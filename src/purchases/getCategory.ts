import { sleep } from "../tools";
import * as cheerio from "cheerio";
import { Project, initDB } from "./dataBase";
let connection = null;
let totalCount = 0;
const auth = "e970e06032c7a87ce278736e523e8050";
const cookie =
  "cookieFinger=1706352401371; AlteonPmall=0a03b7f8318273d71f41; st=e970e06032c7a87ce278736e523e8050";
async function getTotal(pageNum) {
  const pageSize = 2;
  const [data, count] = await connection
    .createQueryBuilder()
    .select("project")
    .from(Project, "project")
    .skip((pageNum - 1) * pageSize)
    .take(pageSize)
    .getManyAndCount();
  totalCount = count;
  let index = 0;
  for (const one of data) {
    if (index % 10 === 9) await sleep(10000);
    const result = await getProjectPublic(one.uuid);
    const json = await result.json();
    console.log("🚀 ~ getTotal ~ json.data:", json.data);
    const { bytes, title } = json.data;

    const $ = cheerio.load(bytes);
    const category = $("#categoryList").text();
    const sellNum = $("#quantity").text();
    await connection
      .createQueryBuilder()
      .update(Project)
      .set({ sellNum: sellNum, category: category, publicTitle: title })
      .where("id = :id", { id: one.id })
      .execute();
    index++;
  }
}

async function getProjectPublic(uuid) {
  return fetch(
    `https://mall.95306.cn/proxy/purchase-service/mall/bulletin/queryContent?uuid=${uuid}`,
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
        cookie: cookie,
        Referer: `https://mall.95306.cn/mall-view/negotiationArea/details-project-ann?uuid=${uuid}`,
        "Referrer-Policy": "no-referrer-when-downgrade",
      },
      body: null,
      method: "GET",
    }
  );
}

async function getProject(pageNum) {
  return fetch(
    `https://mall.95306.cn/proxy/purchase-service/mall/bulletin/queryProjectPageList?pageNo=${pageNum}&pageSize=24&categoryId=&brandId=&title=&beginTime=2022-11-30%2000%3A00%3A00%20&endTime=%202024-01-31%2000%3A00%3A00`,
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
        cookie: cookie,
        Referer:
          "https://mall.95306.cn/mall-view/negotiationArea/more-project-announcements",
        "Referrer-Policy": "no-referrer-when-downgrade",
      },
      body: null,
      method: "GET",
    }
  );
}

async function getList() {
  const totalNum = 2456;
  for (let index = 261; index < totalNum; index++) {
    if (index % 2 === 0 && index !== 0) sleep(10000);
    try {
      const result = await getProject(index);
      console.log("pageNum:", index + 1);
      const json = await result.json();
      const list = json.data.result;

      for (const item of list) {
        try {
          const infoResult = await getProjectPublic(item.uuid);
          const infoJson = await infoResult.json();
          const { bytes, title } = infoJson.data;
          const $ = cheerio.load(bytes);
          const category = $("#categoryList").text();
          const sellNumber = $("#quantity").text();
          console.log(
            "🚀 ~ getList ~ category:",
            category,
            sellNumber,
            item.projId
          );

          await connection
            .createQueryBuilder()
            .update(Project)
            .set({
              sellNumber: sellNumber,
              category: category,
              publicTitle: title,
              proHtml: bytes,
            })
            .where("projId = :projId", { projId: item.projId })

            .execute();
        } catch (e) {
          sleep(5000);
          continue;
        }
      }
    } catch (e) {
      sleep(50000);
      continue;
    }
  }
}

async function run() {
  connection = await initDB();
  await getList();
  connection.close();
}

run();
