var COS = require('cos-nodejs-sdk-v5');
var config = require('./config');
var fs = require('fs');
var path = require('path');
const readdirp = require('readdirp');
require('dotenv').config()

var cos = new COS({
    SecretId: config.SecretId,
    SecretKey: config.SecretKey
});


 function uploadFile (objectName, withHash = false) {
    // 创建测试文件
    var filepath = path.join(__dirname, '../build', objectName);
    const cacheControl = withHash ? 'max-age=31536000' : 'no-cache'
    cos.putObject({
        Bucket: config.Bucket, /* 必须 */
        Region: config.Region,    /* 必须 */
        Key: objectName,              /* 必须 */
        StorageClass: 'STANDARD',
        Prefix:'deploy',
        Body:fs.createReadStream(filepath),
        headers: {
            'Cache-Control': cacheControl
        },
    },function(err, data) {
        console.log('err===',err );
        console.log('data===',data);
    });
    // console.log('filepath',filepath)
 }

 async function upload () {
    // 首先上传不带 hash 的文件
    var filepath = path.join(__dirname, '../build');
    for await (const entry of readdirp(filepath,{depth: 0, type:'files'})) {
        const {path} = entry;
        uploadFile(path)
    }
    // 上传携带 hash 的文件
    for await (const entry of readdirp(filepath,{ type:'files'})) {
        const {path} = entry;
        uploadFile(`${path}`,true)
    }
 }
 upload()