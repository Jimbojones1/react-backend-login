const Recipe = require("../models/recipe");

async function addIngredient(req, res) {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (recipe.ownerId.toString() !== req.user._id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    recipe.ingredients.push(req.body);
    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    res.status(400).json(err);
  }
}

async function updateIngredient(req, res) {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (recipe.ownerId.toString() !== req.user._id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const ingredient = recipe.ingredients.id(req.params.ingredientId);
    ingredient.set(req.body);
    await recipe.save();
    res.json(recipe);
  } catch (err) {
    res.status(400).json(err);
  }
}

async function deleteIngredient(req, res) {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (recipe.ownerId.toString() !== req.user._id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    recipe.ingredients.id(req.params.ingredientId).remove();
    await recipe.save();
    res.json({ message: "Deleted Ingredient" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  addIngredient,
  updateIngredient,
  deleteIngredient,
};

