import { globSync } from "glob";

const gm = require("gm").subClass({ imageMagick: "7+" });
const size = 710;
const length = size;
const width = size;
async function compress(imgPath) {
  await gm(imgPath)
    .resize(length, width)
    .noProfile()
    .write(imgPath, (error) => {
      console.log(error);
    });
}
function getPaths() {
  const path = `${__dirname}/../imgfrom`;
  const arr = globSync(`${path}/**/*.{png,jpeg,jpg}`);
  console.log(arr, arr.length);
  return arr;
}

async function run(index, arr) {
  if (index === arr.length) return;
  const localPath = arr[index];
  try {
    compress(localPath);
    run(index + 1, arr);
  } catch (e) {
    console.log(e);
  }
}

const arr = getPaths();

run(0, arr);
