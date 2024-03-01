var express = require('express')
var api=express.Router();
var artistController = require('../controllers/artist');
var multipart=require('connect-multiparty');
var md_upload=multipart({uploadDir:'uploads/users'})
var md_auth=require('../middlewares/authenticated');

api.get('/artists',artistController.list);
api.post('/artists',artistController.save);
api.post('/artists/:id',[md_upload],artistController.uploadImage);
api.get('/artists/image/:image',artistController.getImage);
api.delete('/artists/image/:id',artistController.delImage);


module.exports = api;