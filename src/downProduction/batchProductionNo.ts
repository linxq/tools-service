let json = require("../../skus.json");

import { encodeToGb2312HexList } from "gb2312-hex";
import { encodeGBK, decodeGBK } from "iconv-gbk";
import { getFilterCode } from "./excel";

import xlsx from "node-xlsx";
import fs from "fs";
import path from "path";

const title = ["序号", "spuId", "skuId", "名称", "code"];

const authCookie = `"Hm_lvt_b56fc9930e6006a67bbf2c85dd2bde0d=1700554715,1700644493,1700740389; ASP.NET_SessionId=ect30mu55azstfiyqv2ei24y; webfxtab_tppane=0; Hm_lpvt_b56fc9930e6006a67bbf2c85dd2bde0d=1702453471; accessToken=eyJhbGciOiJSUzI1NiIsImtpZCI6IjZFMjRDQ0I0MjRGREEzQ0NCMjk2MkFDMTM3Q0REMEJERTQ2MzVDODZSUzI1NiIsInR5cCI6ImF0K2p3dCIsIng1dCI6ImJpVE10Q1Q5bzh5eWxpckJOODNRdmVSalhJWSJ9.eyJuYmYiOjE3MDI0NTM0NTUsImV4cCI6MTcwMjQ2MDY1NSwiaXNzIjoiaHR0cHM6Ly9wYXNzcG9ydC5nZHMub3JnLmNuIiwiY2xpZW50X2lkIjoidnVlanNfY29kZV9jbGllbnQiLCJzdWIiOiIyMTQ4NjcwIiwiYXV0aF90aW1lIjoxNzAyNDUzNDQ5LCJpZHAiOiJsb2NhbCIsInJvbGUiOiJTeXN0ZW1NZW1iZXJDYXJkVXNlciIsIlVzZXJJbmZvIjoie1wiVXNlck5hbWVcIjpcIjIxNzQ0NDBcIixcIkJyYW5kT3duZXJJZFwiOjEyMzgyNTksXCJCcmFuZE93bmVyTmFtZVwiOlwi5rKz5YyX6ZSQ6K-a57q_57yG5pyJ6ZmQ5YWs5Y-4XCIsXCJHY3BDb2RlXCI6W1wiNjk3NzAzMzQyXCJdLFwiVXNlckNhcmROb1wiOlwiMjE3NDQ0MFwiLFwiSXNQYWlkXCI6ZmFsc2UsXCJDb21wYW55TmFtZUVOXCI6XCJcIixcIkNvbXBhbnlBZGRyZXNzQ05cIjpcIuays-WMl-ecgemCouWPsOW4guWugeaZi-WOv-i0vuWutuWPo-mVh-ilv-WAmemrmOadkeadkeWMl1wiLFwiQ29udGFjdFwiOlwi6YOt5LiW5qyjXCIsXCJDb250YWN0VGVsTm9cIjpcIjE1OTMwMTcyODk3XCIsXCJHY3BMaWNlbnNlSG9sZGVyVHlwZVwiOlwiQzM5MzFcIixcIkxlZ2FsUmVwcmVzZW50YXRpdmVcIjpcIuiCluW9puaCslwiLFwiVW5pZmllZFNvY2lhbENyZWRpdENvZGVcIjpcIjkxMTMwNTI4TUEwRzlMUkU0RVwifSIsIlY0VXNlckluZm8iOiJ7XCJVc2VyTmFtZVwiOlwiMjE3NDQ0MFwiLFwiRW1haWxcIjpcIjQ2NTY1MzY1QHFxLmNvbVwiLFwiUGhvbmVcIjpudWxsLFwiQ2FyZE5vXCI6XCIyMTc0NDQwXCJ9IiwianRpIjoiQjYyNTM3N0Q3MzM3NTI2NzIxRUU4NEQyQTgzNzlCNEIiLCJzaWQiOiIxOTVCN0M4QjNENkVDQTQ1OTUxMUREQTJERkMyQjNBMyIsImlhdCI6MTcwMjQ1MzQ1NSwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsImFwaTEiLCJvZmZsaW5lX2FjY2VzcyJdLCJhbXIiOlsicHdkIl19.FmXaKjhQ0EmSOiQfp4XlC5Wg7fc8kT07zbcEWvsvPBiDs6lNpgeE6-39yAZPChyjuW7rwoviTikBFZbR1a19MIck3Jqutc3Efek3FM4IoJdTmbTtffjZ-21ssoL9CGEtTxmzWcnZ5aQ-WS0ELjGWCJFQNq-Mmr3kAbkUl7EOyiFyA1vI35D0nV2ayTiUqXOORfbFB66whcoPsL2DT00HsXW7p07j2D0nPsPHVkBKr2tgrNubT-yr77XKeVaRvv6mli6HTahouNaCdMUjo4VZwDHkZebPhDNMpEs0MSkH6dNei-qOgNX_NPf1S2BxPI3d_JD7xLV-0it7PSRy_cOsVw; userInfo=${encode(
  '{"UserName":"2214031","BrandOwnerId":1236640,"BrandOwnerName":"杭州银棠科技有限公司","GcpCode":["697701862"],"UserCardNo":"2214031","IsPaid":false,"CompanyNameEN":"","CompanyAddressCN":"浙江省杭州市西湖区振华路189号紫润大厦九层914室","Contact":"黄芳","ContactTelNo":"13336080387","GcpLicenseHolderType":"H6335","LegalRepresentative":"黄芳","UnifiedSocialCreditCode":"91330106779253406G"}'
)}`;

const baseCode = "697703342";
const brandName = "锐诚线缆 RUICHENG CABLE";
const gpc = "10005541";
function encode(text) {
  const pattern = new RegExp("[\u4E00-\u9FA5]+");

  let result = "";

  const arrSource = text.split("");

  for (let word of arrSource) {
    if (word === " ") {
      result = `${result}+`;
      continue;
    }

    if (word === "/") {
      result = `${result}%2F`;
      continue;
    }
    if (word === "(") {
      result = `${result}%28`;
      continue;
    }

    if (word === "²") {
      result = `${result}%26%23178%3B`;
      continue;
    }

    if (word === ")") {
      result = `${result}%29`;
      continue;
    }

    if (word === "+") {
      result = `${result}%2B`;
      continue;
    }

    if (word === "×") {
      result = `${result}%A1%C1`;
      continue;
    }

    result = `${result}${encodeGBK(word)}`;
  }
  return result;
}

async function getCode() {
  const result = await fetch(
    "https://manage.gds.org.cn/Product/ExecuteStoredPro",
    {
      headers: {
        accept: "*/*",
        "accept-language": "zh-CN,zh;q=0.9",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "sec-ch-ua":
          '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        cookie: authCookie,
        Referer: "https://manage.gds.org.cn/Product/addProduct?type=new",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: `tccode=${baseCode}&p=0`,
      method: "POST",
    }
  );
  const data = await result.json();
  return data.Result;
}
const errorSkus = [];
async function create(sku, code) {
  try {
    const result = await fetch(
      "https://manage.gds.org.cn/Product/ProductCreate",
      {
        headers: {
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-language": "zh-CN,zh;q=0.9",
          "cache-control": "max-age=0",
          "content-type": "application/x-www-form-urlencoded",
          "sec-ch-ua":
            '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "iframe",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "same-origin",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1",
          cookie: authCookie,
          Referer: "https://manage.gds.org.cn/Product/addProduct?type=new",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: `hiddenfirmcode=697640951&hiddengtin=&Act=new&itemid=&baseid=&is_private=0&thead=0&txt_gtin=${code}&Att_Sys_zh-cn_141_G=${encode(
          sku.skuName
        )}&gpc=${gpc}&Att_Sys_zh-cn_304_G=+${encode(
          brandName
        )}&Att_Sys_zh-cn_11_G=${encode(
          sku.skuName.slice(2, 6) || ""
        )}&codeNet=${encode(
          String(sku.weight)
        )}&codeNetContent=15&specification=${encode(
          sku.modelCode || ""
        )}&Att_Sys_zh-cn_117_G=2023-11-05&Att_Sys_zh-cn_196_G=&priceContent=&fileUrlList=%2Fuserfile1%2FProduct%2F20231126%2F887572249.jpg%23true&exitChemical=1&mlName=%B1%B1%BE%A9%D5%FD%B6%AB%C9%FD%BF%C6%BC%BC%B7%A2%D5%B9%D3%D0%CF%DE%B9%AB%CB%BE&mlNumber=&mlNorm=&ac=0&grpvalue=&grpopenstatus=1`,
        method: "POST",
      }
    );
  } catch (e) {
    console.error("🚀 ~ file: batchProductionNo.ts:118 ~ create ~ e:", e);
    errorSkus[sku];
  }
}

function genData(current) {
  const result = current.map(function (curr, index) {
    return [index + 1, curr.itemId, curr.id, curr.skuName, curr.code];
  });
  return result;
}

async function run() {
  go(0);
}

let time = 100;
async function go(index) {
  if (index >= json.length) {
    console.log(
      "🚀 ~ file: batchProductionNo.ts:130 ~ go ~ errorSkus:",
      errorSkus
    );
    const excelData = genData(json);
    excelData.unshift(title);
    const excelObj: any = { name: "sheet1", data: excelData };
    console.log(
      "🚀 ~ file: batchProductionNo.ts:159 ~ go ~ excelData:",
      excelData
    );
    const buffer = xlsx.build([excelObj]);
    let excelSavePath = path.join(__dirname, "../../data/code.xlsx");
    fs.writeFileSync(excelSavePath, buffer);
    return;
  }
  // if (index > 1) return;
  if (index !== 0 && index % 10 === 0) {
    time = 60 * 1000;
  } else {
    time = 300;
  }

  const current = json[index];

  const code = await getCode();
  current.code = code;
  await create(current, code);
  setTimeout(() => {
    go(index + 1);
  }, time);
}
run();
