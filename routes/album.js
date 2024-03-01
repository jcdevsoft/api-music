var express = require('express')
var api=express.Router();
var albumController = require('../controllers/album');

api.get('/albums',albumController.list);
api.post('/albums',albumController.save);

module.exports = api;