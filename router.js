/*
* @Author: Marte
* @Date:   2017-11-08 15:29:21
* @Last Modified by:   Marte
* @Last Modified time: 2017-11-14 16:43:27
*/

'use strict';
const express = require('express')
const fs = require('fs')
const qs = require('qs')
const path = require('path')
const router = express.Router()
const formidable = require("formidable");

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
router.post('/api/upload', function (req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = 'temp';//缓存地址
    form.multiples = true;//设置为多文件上传
    form.keepExtensions = true;//是否包含文件后缀
    form.parse(req, function (err, fields, files) {
        let keys = Object.keys(files);
        let fieldsName = fields.username || "default";
        //设置存图片的地址
        let targetDir = path.normalize(__dirname + "/static/" + fieldsName + "/")

        //存放图片地址
        let allImage = []


        //验证是否有这个文件夹，没有就创建
        try {
            fs.access(targetDir, function (err) {
                console.log(err);
                if (err) {
                    fs.mkdirSync(targetDir);
                }
                keys.forEach(function (key, index) {
                    let filePath = files[key].path;//获得路径
                    let newpath = path.normalize(__dirname + "/static/" + fieldsName + "/") + files[key].name;//拼接新的地址
                    console.log(filePath)
                    console.log(newpath)
                    fs.renameSync(filePath, newpath)//移动
                })
                res.status(200),
                res.json({
                    msg: '添加成功',
                    success: true,
                    data: null
                });
            });
        } catch (error) {
            res.status(200),
            res.json({
                msg: error.message,
                success: false,
                data:null
            });
        }
    })
})

//获取目录下文件列表
router.get('/api/uploadList/:name', function (req, res) {
    let name=req.params.name
    let fileList=[];
    let filePath = path.normalize(__dirname + "/static/" + name + "/");
    try{
        fileDisplay(filePath,fileList);
        console.log(fileList);
        res.status(200),
        res.json({
            msg: '',
            success: true,
            data: fileList
        });
    }catch(e){
        res.status(200),
        res.json({
            msg: "路径不存在",
            success: false,
            data:null
        });
    }
})

/** 
 * 文件遍历方法 
 * @param filePath 需要遍历的文件路径 
 */  
function fileDisplay(filePath,fileList){  
    //根据文件路径读取文件，返回文件列表  
    let files = fs.readdirSync(filePath);
    files.forEach(function(item,index){
        let filedir = path.join(filePath,item);
        let fileStat = fs.statSync(filedir);
        if(fileStat.isDirectory()){
            fileDisplay(filedir,fileList);
        }else{
            fileList.push(filedir);
        }
    })
}  
module.exports = router