/*
* @Author: limingle
* @Date:   2017-11-28 15:29:21
*/

'use strict';
const express = require('express')
const router = express.Router()

const Upload = require('./app/controller/upload')
const Mock = require('./app/controller/mock')
// websocket服务
const Socket = require('./app/controller/websocket')

router.all('*', function (req, response, next) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Methods", "*");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type,Token");
    response.setHeader("Access-Control-Expose-Headers", "*");
    next()
})

router.all('*', function (req, res, next) {

    if (req.url.indexOf('/api') > -1 || req.url.indexOf('/images') > -1 || req.url.indexOf('favicon.ico') > -1) {
        next()
    } else {
        res.status(304),
        res.send('接口不正确')
    }

})

//上传文件
router.post('/api/upload', Upload.upload)

//获取目录下文件列表
router.get('/api/uploadList/:name', Upload.uploadList)

//根据mock模板生成数据
router.post('/api/getMockData', Mock.getMockData)

module.exports = router