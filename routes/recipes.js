const express = require('express');
const router = express.Router();
const recipesCtrl = require('../controllers/recipes');
const verifyToken = require('../config/verifyToken');

router.post('/', verifyToken, recipesCtrl.create);

module.exports = router;
