import { existsSync, mkdirSync, writeFileSync } from "fs";
import { clearDir } from "../tools/index";
import { downFilter } from "./excel";
const spus = require("../../spus.json");

const basePath = `${__dirname}\\..\\..\\data\\production\\`;

function createSpuDir(spu) {
  const path = `${basePath}\\${spu.id}`;
  if (!existsSync(path)) {
    mkdirSync(path);
  }
  return path;
}

function createSkuDir(spuPath, skuId) {
  const path = `${spuPath}\\${skuId}`;
  if (!existsSync(path)) {
    mkdirSync(path);
  }
  return path;
}

async function fetchImg(pictureUrl) {
  if (!pictureUrl) return null;
  const fetchResult = await fetch(`http:${pictureUrl}`);
  const buffer = await fetchResult.arrayBuffer();

  return buffer;
}

function mathImageUrl(text) {
  const regex = /<img.*?src="(.*?)"/g;
  let match;
  const srcList = [];

  while ((match = regex.exec(text))) {
    //match返回一个数组，数组中有两个数值
    //第一个是img整个标签字段，第二个是src中匹配的内容
    srcList.push(match[1]);
  }
  console.log(
    "🚀 ~ file: createProductionFile.ts:34 ~ mathImageUrl ~ srcList:",
    srcList
  );
  return srcList;
}

async function run() {
  clearDir(basePath);
  const filter = downFilter();
  console.log("🚀 ~ file: createProductionFile.ts:51 ~ run ~ filter:", filter);
  let index = 0;
  for (const currSpu of spus) {
    if (filter && !filter[currSpu.id]) {
      continue;
    }

    const spuDirPath = createSpuDir(currSpu);
    const skus = currSpu.skus;

    const imageText = currSpu.describeUrl;
    const imagePaths = mathImageUrl(imageText);

    let imgIndex = 0;
    for (const imgUrl of imagePaths) {
      const buffer = await fetchImg(imgUrl);
      writeFileSync(`${spuDirPath}\\详情${imgIndex}.png`, Buffer.from(buffer));
      imgIndex++;
    }
    for (const sku of skus) {
      const skuDirPath = createSkuDir(spuDirPath, sku.id);

      const pictureUrl = sku.pictureUrl;
      let imgIndex = 1;
      for (const imgUrl of pictureUrl) {
        const buffer = await fetchImg(imgUrl.pictureUrl);
        if (buffer) {
          writeFileSync(
            `${skuDirPath}\\主图${imgIndex}.png`,
            Buffer.from(buffer)
          );
          imgIndex++;
        }
      }
    }
    index++;
  }
}
run();
