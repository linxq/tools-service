// @ts-ignore
const gm = require("gm").subClass({ imageMagick: "7+" });
const glob = require("glob");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const globSync = glob.globSync;

const imagesArray = globSync(`${__dirname}/../imgfrom/**/*.{png,jpeg,jpg}`);
console.log(imagesArray);
clearDir(`${__dirname}/../imgTo`);

function run(index, length, imagesArray) {
  if (index === length) return;
  const imgPath = `${imagesArray[index]}`;
  const toPath = `${imgPath.replace("imgfrom", "imgTo")}`;
  console.log("🚀 ~ file: combin.ts:17 ~ run ~ imgPath:", imgPath);
  mkdirPath(imgPath);
  mkdirPath(toPath);
  gm(imgPath)
    .resize(800, 800)
    .noProfile()
    .write("./out.jpg", (error) => {
      const middleOut = gm("./out.jpg").identify(async (err, res) => {
        console.log("🚀 ~ file: combin.ts:25 ~ middleOut ~ res:", res.size);
        let left = 0,
          right = 0,
          top = 0,
          bottom = 0;
        if (res?.size?.height === 800) {
          left = (800 - res.size.witdth) / 2;
        } else if (res?.size?.witdth === 800) {
          top = (800 - res.size.height) / 2;
        }

        sharp("./bg.jpg")
          .composite([{ input: imgPath, gravity: "center" }])
          .toFile(toPath)
          .then((info) => {
            run(index + 1, imagesArray.length, imagesArray);
            console.log(" hooray! ");
          })
          .catch(console.log);
      });
      if (error) {
        console.log("背景图生成失败" + error);
        return;
      }
    });
}

run(0, imagesArray.length, imagesArray);

function emptyDir(path) {
  const files = fs.readdirSync(path);
  files.forEach((file) => {
    const filePath = `${path}/${file}`;
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      emptyDir(filePath);
    } else {
      fs.unlinkSync(filePath);
      console.log(`删除${file}文件成功`);
    }
  });
}

function rmEmptyDir(path, level = 0) {
  const files = fs.readdirSync(path);
  if (files.length > 0) {
    let tempFile = 0;
    files.forEach((file) => {
      tempFile++;
      rmEmptyDir(`${path}/${file}`, 1);
    });
    if (tempFile === files.length && level !== 0) {
      fs.rmdirSync(path);
    }
  } else {
    level !== 0 && fs.rmdirSync(path);
  }
}
export function clearDir(path) {
  emptyDir(path);
  rmEmptyDir(path);
}

function mkdirPath(pathStr) {
  let basePath = "";
  let tempDirArray = pathStr.split("\\");
  console.log(
    "🚀 ~ file: combin.ts:91 ~ mkdirPath ~ tempDirArray:",
    tempDirArray
  );

  for (let i = 0; i < tempDirArray.length - 1; i++) {
    basePath = i === 0 ? tempDirArray[i] : basePath + "/" + tempDirArray[i];
    console.log("🚀 ~ file: combin.ts:96 ~ mkdirPath ~ basePath:", basePath);

    if (!fs.existsSync(basePath)) {
      fs.mkdirSync(basePath);
    }
  }
  return basePath;
}
