const express = require('express');
const router = express.Router();
const recipesCtrl = require('../controllers/recipes');
const verifyToken = require('../middleware/verifyToken');
const ingredientsRouter = require('./ingredients');

router.get('/', recipesCtrl.getAll);
router.get('/:id', recipesCtrl.getOne);
router.post('/', verifyToken, recipesCtrl.create);
router.put('/:id', verifyToken, recipesCtrl.update);
router.delete('/:id', verifyToken, recipesCtrl.delete);

// Mount ingredients router
router.use('/:id/ingredients', ingredientsRouter);

// Instructions
router.post('/:id/instructions', verifyToken, recipesCtrl.addInstruction);
router.put('/:id/instructions/:instructionId', verifyToken, recipesCtrl.updateInstruction);
router.delete('/:id/instructions/:instructionId', verifyToken, recipesCtrl.deleteInstruction);

module.exports = router;
