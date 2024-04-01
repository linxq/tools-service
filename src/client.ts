// This file is auto-generated, don't edit it
// 依赖的模块可通过下载工程中的模块依赖文件或右上角的获取 SDK 依赖信息查看
import imageseg20191230, * as $imageseg20191230 from "@alicloud/imageseg20191230";
import OpenApi, * as $OpenApi from "@alicloud/openapi-client";
import Console from "@alicloud/tea-console";
import Util, * as $Util from "@alicloud/tea-util";
import http from "http";
import { createReadStream, writeFile } from "fs";

import { globSync } from "glob";

const getResponse = function (httpClient, url) {
  return new Promise((resolve, reject) => {
    httpClient.get(url, function (response) {
      resolve(response);
    });
  });
};

function getPaths() {
  const path = `${__dirname}/../imgfrom`;
  const arr = globSync(`${path}/**/*.{png,jpeg,jpg}`);
  console.log(arr, arr.length);
  return arr;
}

export default class Client {
  /**
   * 使用AK&SK初始化账号Client
   * @param accessKeyId
   * @param accessKeySecret
   * 

   * @return Client
   * @throws Exception
   */
  static createClient(
    accessKeyId: string,
    accessKeySecret: string
  ): imageseg20191230 {
    let config = new $OpenApi.Config({
      // 必填，您的 AccessKey ID
      accessKeyId: accessKeyId,
      // 必填，您的 AccessKey Secret
      accessKeySecret: accessKeySecret,
    });
    // Endpoint 请参考 https://api.aliyun.com/product/imageseg
    config.endpoint = `imageseg.cn-shanghai.aliyuncs.com`;
    return new imageseg20191230(config);
  }

  /**
   * 使用STS鉴权方式初始化账号Client，推荐此方式。
   * @param accessKeyId
   * @param accessKeySecret
   * @param securityToken
   * @return Client
   * @throws Exception
   */
  static createClientWithSTS(
    accessKeyId: string,
    accessKeySecret: string,
    securityToken: string
  ): imageseg20191230 {
    let config = new $OpenApi.Config({
      // 必填，您的 AccessKey ID
      accessKeyId: accessKeyId,
      // 必填，您的 AccessKey Secret
      accessKeySecret: accessKeySecret,
      // 必填，您的 Security Token
      securityToken: securityToken,
      // 必填，表明使用 STS 方式
      type: "sts",
    });
    // Endpoint 请参考 https://api.aliyun.com/product/imageseg
    config.endpoint = `imageseg.cn-shanghai.aliyuncs.com`;
    return new imageseg20191230(config);
  }

  static async main(): Promise<void> {
    // 请确保代码运行环境设置了环境变量 ALIBABA_CLOUD_ACCESS_KEY_ID 和 ALIBABA_CLOUD_ACCESS_KEY_SECRET。
    // 工程代码泄露可能会导致 AccessKey 泄露，并威胁账号下所有资源的安全性。以下代码示例仅供参考，建议使用更安全的 STS 方式，更多鉴权访问方式请参见：https://help.aliyun.com/document_detail/378664.html
    let client = Client.createClient(
      "AAnRUNkmilVE3ttJ",
      "zo8msE8vAfdl1NDARN9oN74FaL4ZjR"
    );
    const pathArr = getPaths();

    async function segment(index, pathArr: any) {
      if (index === pathArr.length) return;
      const localPath = pathArr[index];
      // const url = new URL(
      //   "https://nxhl-image.oss-cn-beijing.aliyuncs.com/WechatIMG1.jpeg"
      // );
      // const httpClient = url.protocol == "https:" ? https : http;

      let segmentCommodityRequest =
        new $imageseg20191230.SegmentCommonImageAdvanceRequest();

      segmentCommodityRequest.imageURLObject = createReadStream(localPath);
      segmentCommodityRequest.returnForm = "whiteBK";
      let runtime = new $Util.RuntimeOptions({});

      let resp = await client.segmentCommodityAdvance(
        segmentCommodityRequest,
        runtime
      );

      http.get(resp.body.data.imageURL, (res) => {
        //用来存储图片二进制编码
        let imgData = "";

        //设置图片编码格式
        res.setEncoding("binary");

        //检测请求的数据
        res.on("data", (chunk) => {
          imgData += chunk;
        });

        //请求完成执行的回调
        res.on("end", () => {
          // 通过文件流操作保存图片
          writeFile(localPath, imgData, "binary", (error) => {
            if (error) {
              console.log("下载失败");
            } else {
              console.log("下载成功！");
            }
          });
        });
      });
      Console.log(Util.toJSONString(resp));
      segment(index + 1, pathArr);
    }

    segment(0, pathArr);
  }
}

Client.main();
