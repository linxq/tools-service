// @ts-ignore
const gm = require("gm").subClass({ imageMagick: true });

gm(800, 800, "#ffffff").write(`${__dirname}/../bg.jpg`, function (err) {
  if (!err) return console.log("生成成功！！");
  console.error(err);
});
