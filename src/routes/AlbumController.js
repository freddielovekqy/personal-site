var express = require('express');
var router = express.Router();
var logger = require('../common/log/log4js').logger;
var photoService = require('../service/PhotoService');

router.post('/', (request, response, next) => {
    var album = request.body.album;
    var userId = request.session.currentUser._id;
    photoService.addAlbum(userId, album)
        .then(data => {
            response.send(JSON.stringify(data));
        }).catch(function (data) {
            response.send(JSON.stringify(data));
        });
});

router.put('/', (request, response, next) => {
    var album = request.body.album;
    var userId = request.session.currentUser._id;
    photoService.updateAlbum(album)
        .then(data => {
            response.send(JSON.stringify(data));
        }).catch(function (data) {
            response.send(JSON.stringify(data));
        });
});

router.put('/:albumId/default-photo/:photoId', (request, response, next) => {
    var albumId = request.params.albumId;
    var photoId = request.params.photoId;
    photoService.setDefaultPhoto(albumId, photoId)
        .then(data => {
            response.send(JSON.stringify(data));
        }).catch(function (data) {
            response.send(JSON.stringify(data));
        });
});

router.delete('/:albumId', (request, response, next) => {
    var albumId = request.params.albumId;
    photoService.deleteAlbum(albumId)
        .then(data => {
            response.send(JSON.stringify(data));
        }).catch(function (data) {
            response.send(JSON.stringify(data));
        });
});

router.get('/:albumId', (request, response, next) => {
    var albumId = request.params.albumId;
    photoService.findAlbumById(albumId)
        .then(data => {
            response.send(JSON.stringify(data));
        }).catch(function (data) {
            response.send(JSON.stringify(data));
        });
});

router.get('/user/:userId', (request, response, next) => {
    var userId = request.params.userId;
    photoService.findAlbumsByUser(userId)
        .then(data => {
            response.send(JSON.stringify(data));
        }).catch(function (data) {
            response.send(JSON.stringify(data));
        });
})




module.exports = router;