const db = require('../config/db');

exports.logMeal = async (req, res) => {
    const { recipe_id, date, meal_type } = req.body;
    
    try {
        const query = 'INSERT INTO meal_logs (user_id, recipe_id, date, meal_type) VALUES (?, ?, ?, ?)';
        const [result] = await db.query(query, [req.userId, recipe_id, date, meal_type]);
        res.status(201).json({ message: "Meal logged successfully", logId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: "Failed to log meal", error: error.message });
    }
};

exports.getDailyMeals = async (req, res) => {
    const { date } = req.query; // YYYY-MM-DD
    if (!date) return res.status(400).json({ message: "Date is required" });

    try {
        const query = `
            SELECT m.id, m.date, m.meal_type, r.title, r.calories, r.protein, r.carbs, r.fat 
            FROM meal_logs m
            JOIN recipes r ON m.recipe_id = r.id
            WHERE m.user_id = ? AND m.date = ?
        `;
        const [meals] = await db.query(query, [req.userId, date]);
        
        let totalCalories = 0;
        meals.forEach(m => totalCalories += m.calories);

        res.json({ meals, totalCalories });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getAnalytics = async (req, res) => {
    const days = parseInt(req.query.days) || 7;
    try {
        const query = `
            SELECT m.date, SUM(r.calories) as total_calories, SUM(r.protein) as total_protein, SUM(r.carbs) as total_carbs, SUM(r.fat) as total_fat
            FROM meal_logs m
            JOIN recipes r ON m.recipe_id = r.id
            WHERE m.user_id = ? AND m.date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
            GROUP BY m.date
            ORDER BY m.date ASC
        `;
        const [results] = await db.query(query, [req.userId, days]);
        res.json(results);
    } catch (error) {
        console.error("Analytics error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.resetTodayMeals = async (req, res) => {
    try {
        const date = req.query.date || new Date().toISOString().split('T')[0];
        const [result] = await db.query(
            'DELETE FROM meal_logs WHERE user_id = ? AND date = ?',
            [req.userId, date]
        );
        res.json({ message: `Reset successful. ${result.affectedRows} meal(s) removed for today.` });
    } catch (error) {
        console.error("Reset error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
