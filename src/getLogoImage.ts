const glob = require("glob");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const globSync = glob.globSync;

const tools = require("./tools");

const imagesArray = globSync(`${__dirname}/../imgfrom/**/*.{png,jpeg,jpg}`);
const imageArr10 = globSync(`${__dirname}/../imgfrom/**/*.{png,jpeg,jpg}`);
const logoPath = `${__dirname}/../logo.jpg`;
tools.clearDir(`${__dirname}/../imgTo`);
async function run() {
  for (let itemPath of imagesArray) {
    const output = itemPath.replace("imgfrom", "imgTo");
    const arr = output.split(".");
    const newImagePath = `${arr[0]}1.${arr[1]}`;

    tools.mkdirPath(output);
    tools.mkdirPath(newImagePath);
    await sharp(await readImage(itemPath))
      .flop()
      .composite([{ input: await readImage(logoPath), top: 20, left: 20 }])
      .toFile(newImagePath);
    await composeImages(itemPath, logoPath, output);
    console.log("🚀 ~ output:", output);
  }

  for (let path10 of imageArr10) {
    const pathTo = path10.replace("imgfrom", "imgTo");
    tools.mkdirPath(pathTo);
    // let readStream = fs.createReadStream(path10);
    // let writeStream = fs.createWriteStream(pathTo);
    // readStream.pipe(writeStream);
    await sharp(await readImage(path10))
      .resize({ width: 790, fit: "inside", position: "right top" })
      .toFile(pathTo);
    console.log("🚀 ~ pathTo:", pathTo);
  }
}
run();

async function composeImages(input1, input2, output) {
  const image1 = await readImage(input1);
  const image2 = await readImage(input2);
  // 使用sharp的composite方法进行合成

  await sharp(image1)
    .composite([{ input: image2, top: 20, left: 20 }])
    .toFile(output);
}

async function readImage(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}
