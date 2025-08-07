const express = require('express');
const router = express.Router();
const recipesCtrl = require('../controllers/recipes');
const verifyToken = require('../config/verifyToken');

router.get('/', recipesCtrl.getAll);
router.get('/:id', recipesCtrl.getOne);
router.post('/', verifyToken, recipesCtrl.create);
router.patch('/:id', verifyToken, recipesCtrl.update);

module.exports = router;
