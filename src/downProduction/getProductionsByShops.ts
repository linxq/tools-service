import { authCookie, authToken } from "../global";
import xlsx from "node-xlsx";
import fs from "fs";
import path from "path";

const shops = [
  {
    shopId: 202011241075,
    shopName: "国铁商城亨瑞特旗舰店",
  },
  {
    shopId: 202304206774,
    shopName: "国铁商城石顿旗舰店",
  },
  {
    shopId: 202106083457,
    shopName: "国铁商城辽宁佳合晟世旗舰店",
  },
  {
    shopId: 202112301588,
    shopName: "WEDO维度工具旗舰店",
  },
  {
    shopId: 202212264760,
    shopName: "国铁商城凌航得力专卖店",
  },
  {
    shopId: 202107257218,
    shopName: "国铁商城思蒙办公用品专营店",
  },
  {
    shopId: 202102011261,
    shopName: "国铁商城优聚优品晨光办公专营店",
  },
  {
    shopId: 202008210342,
    shopName: "国铁商城洛阳双晨通用工具专营店",
  },
  {
    shopId: 202301105061,
    shopName: "国铁商城福玉金旗舰店",
  },
  {
    shopId: 202110286466,
    shopName: "国铁商城容易购旗舰店",
  },
  {
    shopId: 202005150150,
    shopName: "国铁商城简工智能旗舰店",
  },
  {
    shopId: 202205077673,
    shopName: "国铁商城众泰和盛旗舰店",
  },
  {
    shopId: 202109233649,
    shopName: "国铁商城沁春莱旗舰店",
  },
  {
    shopId: 202109233649,
    shopName: "国铁商城沁春莱旗舰店",
  },
  {
    shopId: 202201213012,
    shopName: "国铁商城燕赵晟世旗舰店",
  },
  {
    shopId: 202110256067,
    shopName: "国铁商城埃林德旗舰店",
  },
  {
    shopId: 202309119507,
    shopName: "国铁商城铁昌旗舰店",
  },
  {
    shopId: 202106284571,
    shopName: "国铁商城乐源天成旗舰店",
  },
  {
    shopId: 202303145967,
    shopName: "国铁商城创祯旗舰店",
  },
  {
    shopId: 202307178626,
    shopName: "国铁商城铭满旗舰店",
  },
  {
    shopId: 202303065829,
    shopName: "国铁商城惠铁旗舰店",
  },
  {
    shopId: 202306077864,
    shopName: "国铁商城途务旗舰店",
  },
];
async function getProductionsByShop(shopId, pageNum) {
  const result = await fetch(
    `https://mall.95306.cn/proxy/elasticsearch-service/mall/search/queryItemListByKeywordNew?platformId=20&pageNum=${pageNum}&keyword=&shopInfoId=${shopId}&materialType=0`,
    {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
        authorization: authToken,
        "sec-ch-ua":
          '"Chromium";v="122", "Not(A:Brand";v="24", "Microsoft Edge";v="122"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        cookie: authCookie,
        Referer: "https://mall.95306.cn/mall-view/shop",
      },
      body: null,
      method: "GET",
    }
  );
  const json = await result.json();
  return json.data;
}

function getExcelData(skus) {
  return skus.map((skus) => {
    return [String(skus.skuId), skus.skuName, skus.sellPrice, skus.shopName];
  });
}

async function getByShopId() {
  let skus = [];
  for (const item of shops) {
    const { shopId, shopName } = item;
    let arr = [];
    let totalNum = 200;
    let index = 0;
    while (arr.length < totalNum) {
      const data = await getProductionsByShop(shopId, index + 1);
      console.log('getProduction:',index)
      if(!data?.itemList) {
        index++
        totalNum=-1
        continue
      }
      arr = arr.concat(data.itemList.resultList);
      totalNum = data.itemList.count;
      index++;
      
    }

    arr.forEach((item, index) => {
      item.item_sku.forEach((item) => (item.shopName = shopName));
      skus = skus.concat(item.item_sku);
    });
  }
  const excelData = getExcelData(skus);
  genExcelFile(excelData);
}
function genExcelFile(exlceData) {
  const title = ["skuIds", "商品名称", "商品价格", "店铺名称"];
  exlceData.unshift(title);
  const excelObj: any = { name: "sheet1", data: exlceData };
  const buffer = xlsx.build([excelObj]);
  let excelSavePath = path.join(__dirname, "../../data/shopProductions.xlsx");
  fs.writeFileSync(excelSavePath, buffer);
}

async function run() {
  getByShopId();
}
run();
