var photoDao = require('../dao/PhotoDao');
var logger = require('../common/log/log4js').logger;
var fs = require("fs");
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
        photoDao.findAlbumById(albumId)
            .then(album => {
                var dbAlbum = album.toObject();
                var photoIds = dbAlbum.photos.map(photo => {
                    return photo._id;
                });
                return deletePhotos(albumId, photoIds);
            })
            .then(data => {
                return photoDao.deleteAlbum(albumId);
            })
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
                var oldAlbum = dbAlbum.toObject();
                var albumId = album._id;
                var newAlbum = Object.assign(oldAlbum, album);
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

function setDefaultPhoto(albumId, photoId) {
    return new Promise((resolve, reject) => {
        photoDao.updateAlbumAttr(albumId, {defaultPhotoId: photoId})
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
                resolve(album.toObject());
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

function deletePhotos(albumId, photoIds) {
    return new Promise((resolve, reject) => {
        var deletePhotosPromises = [];
        photoIds.forEach(photoId => {
            deletePhotosPromises.push(deletePhoto(albumId, photoId));
        });
        Promise.all(deletePhotosPromises)
            .then(albums => {
                resolve(albums);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function deletePhoto(albumId, photoId) {
    return new Promise((resolve, reject) => {
        photoDao.findAlbumById(albumId)
            .then(album => {
                var photo = album.photos.id(photoId).toObject();
                console.log(photo);
                fs.unlinkSync('webapp\\' + photo.path);
                return photoDao.deletePhoto(albumId, photoId);
            })
            .then(albums => {
                resolve(albums);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function updatePhoto(albumId, photoDTO) {
    return new Promise((resolve, reject) => {
        photoDao.findAlbumById(albumId)
            .then(album => {
                var photo = album.photos.id(photoDTO._id).toObject();
                photoDTO.path = photo.path;
                photoDTO.createDate = photo.createDate;
                return photoDao.updatePhoto(photoDTO);
            })
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
module.exports.setDefaultPhoto = setDefaultPhoto;
module.exports.findAlbumById = findAlbumById;
module.exports.findAlbumsByUser = findAlbumsByUser;
module.exports.addPhoto = addPhoto;
module.exports.deletePhotos = deletePhotos;
module.exports.deletePhoto = deletePhoto;
module.exports.updatePhoto = updatePhoto;
module.exports.findPhotosByAlbum = findPhotosByAlbum;