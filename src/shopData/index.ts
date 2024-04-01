import xlsx from "node-xlsx";
import fs from "fs";
import path from "path";

const auth = "a09334345c5d0a535b5e82d553c1a6b3";
const cookie =
  "cookieFinger=1705656328735; st=a09334345c5d0a535b5e82d553c1a6b3; AlteonPmall=0a03b7f5fe532d961f41";
let totalCount = 10000;
let list = [];
let categoryList = [];
const errorList = [];
async function fetchShop(pageNum) {
  return fetch(
    `https://mall.95306.cn/proxy/elasticsearch-service/mall/search/queryShopListByKeyword?platformId=20&accountId=1&keyword=&isBuy=false&pageNum=${pageNum}&pageSize=20&materialType=0`,
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
          "https://mall.95306.cn/mall-view/findShop?keyword=&materialType=0",
        "Referrer-Policy": "no-referrer-when-downgrade",
      },
      body: null,
      method: "GET",
    }
  );
}

async function getCatgoryList() {
  return fetch(
    "https://mall.95306.cn/proxy/item/mall/frontcategory/getAllCategoryList?platformId=20&businessType=1",
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
          "https://mall.95306.cn/mall-view/product/search?keyword=&brands=%E9%BC%8E%E6%B4%81%E7%9B%9B%E4%B8%96(1003442)&materialType=0",
        "Referrer-Policy": "no-referrer-when-downgrade",
      },
      body: null,
      method: "GET",
    }
  );
}

async function mkCategory() {
  const result = await getCatgoryList();
  const json = await result.json();
  const list = json.data;

  for (let item of list) {
    item.secondPlatformCategoryList.map((secondCategory) => {
      secondCategory.thirdPlatformCategoryList.map((thridCategory) => {
        const category = {
          ...thridCategory,
          ffcid: item.fcid,
          fname: item.name,
          sfcid: secondCategory.fcid,
          sname: secondCategory.name,
        };
        categoryList.push(category);
      });
    });
  }
}

async function getShopList(pageNum) {
  console.log(`pageNum:${pageNum}`);
  // if (list.length >= 3850) return;
  if (pageNum > 494) return;
  const result = await fetchShop(pageNum);
  const resultJson = await result.json();
  const json = resultJson.data.shopList;
  const { count, resultList } = json;
  totalCount = count;
  list = list.concat(resultList);

  await getShopList(pageNum + 1);
}

async function getShopInfo(shopId) {
  console.log(`getShopInfo:${shopId}`);
  return fetch(
    `https://mall.95306.cn/proxy/elasticsearch-service/mall/search/queryItemListByKeywordNew?platformId=20&shopInfoId=${shopId}&materialType=0`,
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
        Referer: `https://mall.95306.cn/mall-view/shop?shopId=${shopId}`,
        "Referrer-Policy": "no-referrer-when-downgrade",
      },
      body: null,
      method: "GET",
    }
  );
}

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function getAllShopInfo() {
  let index = 0;
  for (const shop of list) {
    try {
      const infoResult = await getShopInfo(shop.shopId);
      const infoJson = await infoResult.json();
      shop.category = [];
      shop.thridCategory = [];
      infoJson.data.allCids.forEach((item) => {
        const category = categoryList.find(
          (category) => category.fcid === item.id
        );
        shop.category.push(category.fname);
        shop.thridCategory.push(item.name);
      });
      shop.categoryStr = Array.from(new Set(shop.category)).join(",");
      shop.thridCategoryStr = shop.thridCategory.join(",");

      const mobileInfo = await getMobileNumber(shop.shopId);
      const mobileInfoJson = await mobileInfo.json();
      shop.mobileInfo = mobileInfoJson.data.mobile;
      if (index % 10 === 0 && index !== 0) {
        await sleep(15000);
      }
      index++;
    } catch (error) {
      errorList.push(shop);
      console.log("🚀 ~ file: index.ts:128 ~ getAllShopInfo ~ error:", error);
    }
  }
}

async function getMobileNumber(shopId) {
  console.log(`getMobileNumber:${shopId}`);
  return fetch(
    `https://mall.95306.cn/proxy/user/mall/shop/queryShopInfoByShopInfoId?platformId=20&shopId=${shopId}&shopInfoId=${shopId}`,
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
        Referer: `https://mall.95306.cn/mall-view/shop?shopId=${shopId}`,
        "Referrer-Policy": "no-referrer-when-downgrade",
      },
      body: null,
      method: "GET",
    }
  );
}

async function writeFile() {
  const title = [
    "店名",
    "公司名称",
    "手机号码",
    "销量",
    "一级类目",
    "三级类目",
  ];
  const excelData = [];
  for (const one of list) {
    excelData.push([
      one.shopName,
      one.supplierName,
      one.mobileInfo,
      one.shopSaleCount,
      one.categoryStr,
      one.thridCategoryStr,
    ]);
  }
  excelData.unshift(title);
  const excelObj: any = { name: "sheet1", data: excelData };
  const buffer = xlsx.build([excelObj]);
  let excelSavePath = path.join(__dirname, "./result.xlsx");
  fs.writeFileSync(excelSavePath, buffer);
}

async function run() {
  await mkCategory();
  await getShopList(300);
  await sleep(10000);
  await getAllShopInfo();
  await writeFile();
  console.log(categoryList);
}

run();
