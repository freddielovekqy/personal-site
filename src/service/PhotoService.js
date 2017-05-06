var photoDao = require('../dao/PhotoDao');
var logger = require('../common/log/log4js').logger;
var _ = require('lodash');

function addAlbum(userId, album) {
    return new Promise((resolve, reject) => {
        photoDao.findAlbumsByUser(userId)
            .then(albums => {
                if (_.findIndex(albums, {name: album.name}) === -1) {
                    return photoDao.addAlbum(userId, album);
                } else {
                    reject({errorMessage: '已经有重复的相册'});
                }
            }).then(data => {
                resolve(data);
            });
    });
}

function findAlbumsByUser(userId) {
    return new Promise((resolve, reject) => {
        photoDao.findAlbumsByUser(userId)
            .then(albums => {
                resolve(albums);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function addPhoto(albumId, photoDTO) {
    return new Promise((resolve, reject) => {
        photoDao.addPhoto(albumId, photoDTO)
            .then(data => {
                resolve(data);
            });
    });
}

module.exports.addAlbum = addAlbum;
module.exports.findAlbumsByUser = findAlbumsByUser;
module.exports.addPhoto = addPhoto;