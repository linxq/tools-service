import fs from "fs";

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

/**
 * 清空文件夹
 * @param path
 */
export function clearDir(path) {
  emptyDir(path);
  rmEmptyDir(path);
}
/**
 * 制作文件夹路径
 * @param pathStr
 * @returns
 */
export function mkdirPath(pathStr) {
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

/**
 * 睡眠
 * @param time
 * @returns
 */

export function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
