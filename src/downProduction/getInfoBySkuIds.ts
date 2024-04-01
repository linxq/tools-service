import { getSkuIds } from "./excel";
import xlsx from "node-xlsx";
import fs from "fs";
import path from "path";
import { authCookie, authToken } from "../global";

async function getSkuPic(skuId) {
  const result = await fetch(
    `https://mall.95306.cn/proxy/item/mall/search/querySkuPrice?platformId=20&skuIds=${skuId}`,
    {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
        authorization: authToken,
        "sec-ch-ua":
          '"Microsoft Edge";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        cookie: authCookie,
        Referer: "https://mall.95306.cn",
        "Referrer-Policy": "no-referrer-when-downgrade",
      },
      body: null,
      method: "GET",
    }
  );
  const json = await result.json();
  console.log("🚀 ~ getSkuPic ~ json:", json);
  return json.data[0];
}

const title = ["skuIds", "商品名称", "商品价格", "店铺名称"];

async function run() {
  const skuIds = getSkuIds();
  skuIds.shift();
  const arr = [];

  for (const skuId of skuIds) {
    if (!skuId) break;
    const data = await getSkuPic(skuId);
    const item = [String(skuId), data.skuName, data.sellPrice, data.shopName];
    arr.push(item);
  }

  arr.unshift(title);
  const excelObj: any = { name: "sheet1", data: arr };
  const buffer = xlsx.build([excelObj]);
  let excelSavePath = path.join(__dirname, "../../data/productionInfo.xlsx");
  fs.writeFileSync(excelSavePath, buffer);
}

run();
