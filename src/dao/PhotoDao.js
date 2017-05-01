var PhotoSchema = require('../model/photo');
var Photo = PhotoSchema.Photo;
var Album = PhotoSchema.Album;

/* 相册DAO */
function addAlbum(albumDto) {
    var albumEntity = new Album({
        name: albumDto.name,
        userId: albumDto.userId,
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
function findPhotosByAlbums(albumId, status = 1) {
    return Album.find({_id: albumId, status: status}).lean().exec();
}
