import { sleep } from "../tools";
import * as cheerio from "cheerio";
import { Project, initDB } from "./dataBase";
import { getConnection } from "typeorm";
const auth = "d8d0bcff9a93a0e7e106ebcdd73a2684";
const authCookie =
  "cookieFinger=1705559423929; AlteonPmall=0a03b7f2714f1e351f41; st=d8d0bcff9a93a0e7e106ebcdd73a2684";

async function getData(pageNum) {
  return fetch(
    `https://mall.95306.cn/proxy/purchase-service/mall/bulletin/queryResultPageList?pageNo=${pageNum}&pageSize=24&title=&beginTime=2023-01-01%2000%3A00%3A00%20&endTime=%202024-03-31%2000%3A00%3A00`,
    {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
        authorization: auth,
        "sec-ch-ua":
          '"Not_A Brand";v="8", "Chromium";v="120", "Microsoft Edge";v="120"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        cookie: authCookie,
        Referer:
          "https://mall.95306.cn/mall-view/negotiationArea/more-result-announcements",
        "Referrer-Policy": "no-referrer-when-downgrade",
      },
      body: null,
      method: "GET",
    }
  );
}

let totalPage = 2187;
let list = [];
async function genList(num) {
  console.log("🚀 ~ file: index.ts:39 ~ genList ~ page num:", num);
  if (num >= totalPage) return list;
  if (num % 5 === 0 && num !== 0) await sleep(12000);

  const result = await getData(num);
  const json = await result.json();
  const data = json.data;
  // totalCount = +json.totalCount;
  list = list.concat(data.result);
  await genList(num + 1);
}

async function run() {
  await genList(1542);
  const connection = await initDB();
  for (const oneProject of list) {
    try {
      const $ = cheerio.load(oneProject.content);
      const tds: any = $("table tbody tr:eq(1) td p span");
      const secondTds: any = $("table:eq(1) tbody tr:eq(1) td p span");
      const spans = $("span[style*='font-family:仿宋']");
      const reg = new RegExp(String.fromCharCode(160), "g");
      oneProject.merchant = $(tds[1]).text();
      oneProject.productionName = $(tds[2]).text();
      oneProject.brandName = $(tds[3]).text();
      oneProject.model = $(tds[4]).text();
      oneProject.sellNumber = $(tds[5]).text();
      oneProject.unit = $(tds[6]).text();
      oneProject.department = $(secondTds[3]).text();
      oneProject.contectPerson = $(spans[29]).text().replace(reg, "");
      oneProject.contectNumber = $(spans[30]).text().replace(reg, "");
      oneProject.checkPerson = $(spans[31]).text().replace(reg, "");
      oneProject.checkNumber = $(spans[32]).text().replace(reg, "");
      oneProject.html = oneProject.content;
      console.log(oneProject.productionName);
      await connection
        .createQueryBuilder()
        .insert()
        .into(Project)
        .values([oneProject])
        .execute();
    } catch (e) {
      console.log("🚀 ~ file: index.ts:62 ~ run ~ e:", e);
    }
  }
  connection.close();
  console.warn("end");
}
run();
