const express = require("express");
const router = express.Router({ mergeParams: true });
const ingredientsCtrl = require("../controllers/ingredients");
const verifyToken = require("../middleware/verifyToken");

// Note: All paths in this file are implicitly prefixed with '/:id/ingredients'
// because of how this router is mounted in routes/recipes.js

// POST /recipes/:id/ingredients
router.post("/", verifyToken, ingredientsCtrl.addIngredient);

// PUT /recipes/:id/ingredients/:ingredientId
router.put("/:ingredientId", verifyToken, ingredientsCtrl.updateIngredient);

// DELETE /recipes/:id/ingredients/:ingredientId
router.delete("/:ingredientId", verifyToken, ingredientsCtrl.deleteIngredient);

module.exports = router;
