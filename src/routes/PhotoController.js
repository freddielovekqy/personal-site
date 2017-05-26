var express = require('express');
var formidable = require('formidable');
var fs = require("fs");
var util = require('util');

var router = express.Router();
var logger = require('../common/log/log4js').logger;
var photoService = require('../service/PhotoService');

/**
 * URL：/api/photo/upload
 * 图片上传，使用了nodejs的formidable进行文件上传
 */
router.post('/upload', (request, response, next) => {
    var form = new formidable.IncomingForm({
        encoding: 'utf-8', // 编码格式
        uploadDir: 'webapp/image/photos',  //文件上传地址
        keepExtensions: true,  //保留后缀
        maxFieldsSize: 2 * 1024 * 1024 //设置单文件大小限制
    });

    form.parse(request, function (err, fields, files) {
        // 文件上传完成后执行
        if (!err) {
            var file = files.file;
            var fileName = file.path.split('\\')[file.path.split('\\').length - 1];
            var albumId = fields.albumId;
            var photo = {
                name: fields.name,
                description: fields.description,
                path: 'image/photos/' + fileName
            };
            // 调用service将图片信息保存入库
            photoService.addPhoto(albumId, photo)
                .then(data => {
                    response.send(JSON.stringify(data));
                }).catch(function (data) {
                    response.send(JSON.stringify(data));
                });
        } else {
            // 文件上传失败，返回错误信息
            response.send(JSON.stringify(err));
        }
    });
});

router.put('/', (request, response, next) => {
    var albumId = request.body.albumId;
    var photo = request.body.photo;
    photoService.updatePhoto(albumId, photo)
        .then(data => {
            response.send(JSON.stringify(data));
        }, data => {
            response.status(400).send(JSON.stringify(data));
        }).catch(function (data) {
            response.status(500).send(JSON.stringify(data));
        });
});

router.delete('/:photoId/album/:albumId', (request, response, next) => {
    var albumId = request.params.albumId;
    var photoId = request.params.photoId;
    photoService.deletePhoto(albumId, photoId)
        .then(data => {
            response.send(JSON.stringify(data));
        }, data => {
            response.status(400).send(JSON.stringify(data));
        }).catch(function (data) {
            response.status(500).send(JSON.stringify(data));
        });
});

router.delete('/', (request, response, next) => {
    var albumId = request.query.albumId;
    var photoIds = request.query.photoIds;
    photoService.deletePhotos(albumId, photoIds)
        .then(data => {
            response.send(JSON.stringify(data));
        }, data => {
            response.status(400).send(JSON.stringify(data));
        }).catch(function (data) {
            response.status(500).send(JSON.stringify(data));
        });
});

router.get('/album/:albumId', (request, response, next) => {
    var albumId = request.params.albumId;
    photoService.findPhotosByAlbum(albumId)
        .then(data => {
            response.send(JSON.stringify(data));
        }).catch(function (data) {
            response.send(JSON.stringify(data));
        });
});

module.exports = router;