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

function updateAlbum(albumId, albumDTO) {
    return Album.update({_id: albumId}, albumDTO);
}

function updateAlbumAttr(albumId, updateAttr) {
    return Album.update({_id: albumId}, {$set: updateAttr});
}

function findAlbumById(albumId) {
    return Album.findById(albumId).exec();
}

function findAlbumsByUser(userId, status = 1) {
    return Album.find({userId: userId, status: status}).lean().exec();
}



/* 照片DAO */
function addPhoto(albumId, photoDTO) {
    var photoEntity = new Photo({
        path: photoDTO.path,
        name: photoDTO.name,
        description: photoDTO.description
    });
    return Album.update({'_id': albumId}, {$addToSet: {'photos': photoEntity}});
} 

function deletePhoto(albumId, photoId) {
    return Album.update({_id: albumId}, {$pull: {photos: {_id: photoId}}});
}

function findPhoto(photoId) {
    return Album.find({'photos._id': photoId}).exec();
}

function findPhotosByAlbum(albumId, status = 1) {
    return Album.find({_id: albumId, status: status}, {photos: 1}).lean().exec();
}

module.exports.addAlbum = addAlbum;
module.exports.deleteAlbum = deleteAlbum;
module.exports.updateAlbum = updateAlbum;
module.exports.updateAlbumAttr = updateAlbumAttr;
module.exports.findAlbumById = findAlbumById;
module.exports.findAlbumsByUser = findAlbumsByUser;
module.exports.addPhoto = addPhoto;
module.exports.deletePhoto = deletePhoto;
module.exports.findPhoto = findPhoto;
module.exports.findPhotosByAlbum = findPhotosByAlbum;