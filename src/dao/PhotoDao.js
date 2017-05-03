var PhotoSchema = require('../model/photo');
var Photo = PhotoSchema.Photo;
var Album = PhotoSchema.Album;

/* 相册DAO */
function addAlbum(userId, albumDto) {
    var albumEntity = new Album({
        name: albumDto.name,
        userId: userId,
        description: albumDto.description
    });
    return albumEntity.save();
}

function deleteAlbum(albumId) {
    return Album.update({_id: albumId}, {$set: {status: 0}});
}

function updateAlbum(albumDTO) {
    return Album.update({_id: albumDTO._id}, albumDTO);
}

function findAlbumsByUser(userId, status = 1) {
    return Album.find({userId: userId, status: status}, {photos: 0}).lean().exec();
}



/* 照片DAO */
function addPhoto(albumId, photoDTO) {
    var photoEntity = new Photo({
        path: photoDTO.path,
        name: photoDTO.name,
        description: photoDTO.description
    });
    return Album.update({_id: albumId}, {$set: {'phtots.$': photoEntity}});
} 

function deletePhoto(albumId, photoId) {
    return Album.update({_id: albumId}, {$pull: {_id: photoId}});
}

function findPhotosByAlbums(albumId, status = 1) {
    return Album.find({_id: albumId, status: status}).lean().exec();
}

module.exports.addAlbum = addAlbum;
module.exports.deleteAlbum = deleteAlbum;
module.exports.updateAlbum = updateAlbum;
module.exports.findAlbumsByUser = findAlbumsByUser;
module.exports.addPhoto = addPhoto;
module.exports.deletePhoto = deletePhoto;
module.exports.findPhotosByAlbums = findPhotosByAlbums;