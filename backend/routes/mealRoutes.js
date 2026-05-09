const express = require('express');
const router = express.Router();
const mealController = require('../controllers/mealController');
const { verifyToken } = require('../middlewares/auth');

router.post('/', verifyToken, mealController.logMeal);
router.get('/daily', verifyToken, mealController.getDailyMeals);
router.get('/analytics', verifyToken, mealController.getAnalytics);
router.delete('/daily', verifyToken, mealController.resetTodayMeals);

module.exports = router;
