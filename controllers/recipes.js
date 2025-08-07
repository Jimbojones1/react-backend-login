const Recipe = require('../models/recipe');

module.exports = {
    create
};

async function create(req, res) {
    try {
        const recipe = await Recipe.create({ ...req.body, ownerId: req.user._id });
        res.status(201).json(recipe);
    } catch (err) {
        res.status(400).json(err);
    }
}
