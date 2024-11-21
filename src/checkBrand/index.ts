import { writeFile, writeFileSync } from "fs";

import xlsx from "node-xlsx";
import fs from "fs";
import path from "path";
import { authCookie, authToken, shopInfoId } from "../global";
import { getBrands } from "../downProduction/excel";
const title = ["品牌名称", "结果"];

function getBrandByName(cname) {
  return new Promise(function (resolve, reject) {
    fetch(
      `https://mall.95306.cn/proxy/elasticsearch-service/mall/search/queryItemListByKeywordForChannel?keyword=${encodeURIComponent(
        cname
      )}&platformId=20&materialType=0`,
      {
        headers: {
          accept: "application/json, text/javascript, */*; q=0.01",
          "accept-language": "zh-CN,zh;q=0.9",
          authorization: authToken,
          "sec-ch-ua":
            '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest",
          cookie: authCookie,
          Referer:
            "https://mall.95306.cn/mall-view/product/search?keyword=&brands=%E6%AD%A3%E4%B8%9C%E5%8D%87(2088224)&materialType=0",
          "Referrer-Policy": "no-referrer-when-downgrade",
        },
        body: null,
        method: "GET",
      }
    )
      .then(function (res) {
        res.json().then(resolve).catch(reject);
      })
      .catch(reject);
  });
}

function serachByBrand(brandName) {
  return new Promise(function (resolve, reject) {
    fetch(
      `https://mall.95306.cn/proxy/elasticsearch-service/mall/search/queryItemListByKeywordNew?keyword=&brands=${encodeURIComponent(
        brandName
      )}&materialType=0&brandsString=${encodeURIComponent(
        brandName
      )}&platformId=20&pageNum=1`,
      {
        headers: {
          accept: "application/json, text/javascript, */*; q=0.01",
          "accept-language": "zh-CN,zh;q=0.9",
          authorization: authToken,
          "sec-ch-ua":
            '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest",
          cookie: authCookie,
          Referer:
            "https://mall.95306.cn/mall-view/product/search?keyword=&brands=%E6%AD%A3%E4%B8%9C%E5%8D%87(2088224)&materialType=0",
          "Referrer-Policy": "no-referrer-when-downgrade",
        },
        body: null,
        method: "GET",
      }
    )
      .then(function (res) {
        res.json().then(resolve).catch(reject);
      })
      .catch(reject);
  });
}
function checkBrand(itemId) {
  return new Promise(function (resolve, reject) {
    fetch(
      `https://mall.95306.cn/proxy/item-service//mall/search/queryItemBrandGrade?platformId=20&itemId=${itemId}`,
      {
        headers: {
          accept: "application/json, text/javascript, */*; q=0.01",
          "accept-language": "zh-CN,zh;q=0.9",
          authorization: "79813847c0db09a22f1620ed084ab03e",
          "sec-ch-ua":
            '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest",
          cookie:
            "cookieFinger=1725767267556; st=79813847c0db09a22f1620ed084ab03e; AlteonPmall=0a03b7f571a796541f41",
          Referer:
            "https://mall.95306.cn/mall-view/product/detail?itemId=10008190032",
          "Referrer-Policy": "no-referrer-when-downgrade",
        },
        body: null,
        method: "GET",
      }
    )
      .then(function (res) {
        res.json().then(resolve).catch(reject);
      })
      .catch(reject);
  });
}

export function genExcel(excelData) {
  excelData.unshift(title);
  const excelObj: any = { name: "sheet1", data: excelData };
  const buffer = xlsx.build([excelObj]);
  let excelSavePath = path.join(__dirname, "../../excel/brandsResult.xlsx");
  fs.writeFileSync(excelSavePath, buffer);
}

async function init() {
  let brandNames: any = getBrands();
  brandNames.shift();
  let brandResult = [];
  for (let brandName of brandNames) {
    const current = [brandName];
    const info: any = await getBrandByName(brandName);
    const name =
      info?.data?.data?.length > 0 ? info?.data?.data[0].brandNameChEn : null;
    if (!name) {
      current[1] = "没有品牌信息";
      brandResult.push(current);
      continue;
    }
    const serachResult: any = await serachByBrand(name);

    const itemId =
      serachResult?.data?.itemList?.count > 0
        ? serachResult?.data?.itemList.resultList[0].itemId
        : null;
    if (!itemId) {
      current[1] = "品牌没有商品";
      brandResult.push(current);
      continue;
    }
    const result: any = await checkBrand(itemId);
    current[1] = result?.data;
    brandResult.push(current);
  }
  genExcel(brandResult);
}

init();
