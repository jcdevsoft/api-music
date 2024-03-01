var express = require('express')
var api=express.Router();
var songController = require('../controllers/song');
var multipart=require('connect-multiparty');
var md_upload=multipart({uploadDir:'uploads/users'})
var md_auth=require('../middlewares/authenticated');

api.get('/songs',songController.list);
api.post('/songs',songController.save);
api.post('/song/:id',[md_upload],songController.uploadSong);
api.get('/songs/file/:file',songController.getSong);
api.delete('/songs/file/:id',songController.delSong);

module.exports = api;