var express = require('express');
var multiparty = require('multiparty');
var fs = require("fs");
var util = require('util');

var router = express.Router();
var logger = require('../common/log/log4js').logger;
var photoService = require('../service/PhotoService');

// router.post('/', (req, res, next) => {
//     var size = '';
//   var file_name = '';
//   var destination_path = '';

//   // Instatiation in order to use the API options multiparty.Form({options})
//   var form = new multiparty.Form();

//   form.on('error', function (err) {
//     console.log('Error parsing form: ' + err.stack);
//   });

//   form.on('part', function (part) {
//     if (!part.filename)
//         return;
//     size = part.byteCount;
//     file_name = part.filename;
//   });

//   form.on('file', function (name, file) {
//     var temporal_path = file.path;
//     var extension = file.path.substring(file.path.lastIndexOf('.'));
//     destination_path = './public/uploads/' + uuid.v4() + extension;
//     var input_stream = fs.createReadStream(temporal_path);
//     var output_stream = fs.createWriteStream(destination_path);
//     input_stream.pipe(output_stream);

//     input_stream.on('end',function() {
//         fs.unlinkSync(temporal_path);
//         console.log('Uploaded : ', file_name, size / 1024 | 0, 'kb', file.path, destination_path);
//     });
//   });

//   form.on('close', function(){
//     res.end('Uploaded!');
//   });

//   form.parse(req);
// });

router.post('/', (request, response, next) => {
    var photo = request.body.photo;
    var albumId = request.body.albumId;
    photoService.addPhoto(albumId, photo)
        .then(data => {
            response.send(JSON.stringify(data));
        }).catch(function (data) {
            response.send(JSON.stringify(data));
        });
});

router.delete('/:photoId/album/:albumId', (request, response, next) => {
    var albumId = request.params.albumId;
    var photoId = request.params.photoId;
    photoService.deletePhoto(albumId, photoId)
        .then(data => {
            response.send(JSON.stringify(data));
        }).catch(function (data) {
            response.send(JSON.stringify(data));
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