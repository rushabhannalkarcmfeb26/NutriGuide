const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const { verifyToken, isAdmin } = require('../middlewares/auth');

router.get('/', recipeController.getAllRecipes);
router.get('/recommendations', verifyToken, recipeController.getRecommendations);
router.post('/', verifyToken, isAdmin, recipeController.createRecipe);
router.delete('/:id', verifyToken, isAdmin, recipeController.deleteRecipe);

module.exports = router;
