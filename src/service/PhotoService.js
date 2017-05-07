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

function deleteAlbum(albumId) {
    return new Promise((resolve, reject) => {
        photoDao.deleteAlbum(albumId)
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function updateAlbum(album) {
    return new Promise((resolve, reject) => {
        photoDao.findAlbumById(album._id)
            .then(dbAlbum => {
                var albumId = album._id;
                var newAlbum = Object.assign(dbAlbum, album);
                delete newAlbum._id;
                return photoDao.updateAlbum(albumId, newAlbum);
            })
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function findAlbumById(albumId) {
    return new Promise((resolve, reject) => {
        photoDao.findAlbumById(albumId)
            .then(album => {
                resolve(album);
            })
            .catch(error => {
                reject(error);
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

function deletePhoto(albumId, photoId) {
    return new Promise((resolve, reject) => {
        photoDao.deletePhoto(albumId, photoId)
            .then(albums => {
                resolve(albums);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function findPhotosByAlbum(albumId) {
    return new Promise((resolve, reject) => {
        photoDao.findPhotosByAlbum(albumId)
            .then(albums => {
                resolve(albums);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports.addAlbum = addAlbum;
module.exports.deleteAlbum = deleteAlbum;
module.exports.updateAlbum = updateAlbum;
module.exports.findAlbumById = findAlbumById;
module.exports.findAlbumsByUser = findAlbumsByUser;
module.exports.addPhoto = addPhoto;
module.exports.deletePhoto = deletePhoto;
module.exports.findPhotosByAlbum = findPhotosByAlbum;