const db = require('../config/db');

exports.getAllRecipes = async (req, res) => {
    try {
        const [recipes] = await db.query('SELECT * FROM recipes ORDER BY created_at DESC');
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getRecommendations = async (req, res) => {
    try {
        const [users] = await db.query('SELECT diet_preference, allergies, health_goal, weight, target_weight FROM users WHERE id = ?', [req.userId]);
        if (users.length === 0) return res.status(404).json({ message: "User not found" });

        const preference = users[0].diet_preference;
        const allergiesStr = users[0].allergies;
        const health_goal = users[0].health_goal;
        const weight = users[0].weight;
        const target_weight = users[0].target_weight;
        let finalRecipes = [];

        if (preference === 'vegan') {
            const [vegan] = await db.query('SELECT * FROM recipes WHERE diet_tag = "vegan"');
            finalRecipes = vegan;
        } else if (preference === 'vegetarian') {
            const [veg] = await db.query('SELECT * FROM recipes WHERE diet_tag = "vegetarian"');
            const numVegan = Math.ceil(veg.length / 9) || 1; // ~10%
            const [vegan] = await db.query('SELECT * FROM recipes WHERE diet_tag = "vegan" ORDER BY RAND() LIMIT ?', [numVegan]);
            finalRecipes = [...veg, ...vegan];
        } else if (preference === 'non-vegetarian') {
            // non-veg users get mix of vegetarian + non-vegetarian
            const [veg] = await db.query('SELECT * FROM recipes WHERE diet_tag = "vegetarian"');
            const numNonVeg = Math.ceil(veg.length * (30/70)) || 1; // ~30%
            const [nonVeg] = await db.query('SELECT * FROM recipes WHERE diet_tag = "non-vegetarian" ORDER BY RAND() LIMIT ?', [numNonVeg]);
            finalRecipes = [...veg, ...nonVeg];
        } else {
            const [all] = await db.query('SELECT * FROM recipes');
            finalRecipes = all;
        }

        if (allergiesStr) {
            const allergyList = allergiesStr.split(',').map(a => a.trim().toLowerCase()).filter(a => a);
            if (allergyList.length > 0) {
                finalRecipes = finalRecipes.filter(recipe => {
                    let ingredients = [];
                    try {
                        ingredients = typeof recipe.ingredients === 'string' ? JSON.parse(recipe.ingredients) : recipe.ingredients;
                    } catch (e) {}
                    
                    const hasAllergy = allergyList.some(allergy => {
                        return ingredients.some(ing => typeof ing === 'string' && ing.toLowerCase().includes(allergy));
                    });
                    return !hasAllergy;
                });
            }
        }

        // Filter and Sort by Calories based on health goal
        const isLoseWeight = health_goal === 'lose_weight' || (target_weight && weight && target_weight < weight);
        const isGainWeight = health_goal === 'gain_muscle' || (target_weight && weight && target_weight > weight);

        if (isLoseWeight) {
            // Suggest low calorie food
            const lowCalorie = finalRecipes.filter(r => r.calories <= 500);
            if (lowCalorie.length > 3) finalRecipes = lowCalorie;
            finalRecipes.sort((a, b) => a.calories - b.calories);
        } else if (isGainWeight) {
            // Suggest high calorie food
            const highCalorie = finalRecipes.filter(r => r.calories >= 600);
            if (highCalorie.length > 3) finalRecipes = highCalorie;
            finalRecipes.sort((a, b) => b.calories - a.calories);
        } else {
            // Maintain weight
            finalRecipes.sort(() => 0.5 - Math.random());
        }

        // Return top 10 recommended
        res.json(finalRecipes.slice(0, 10));
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.createRecipe = async (req, res) => {
    const { title, description, ingredients, instructions, calories, protein, carbs, fat, diet_tag, image_url } = req.body;

    try {
        const query = `
            INSERT INTO recipes (title, description, ingredients, instructions, calories, protein, carbs, fat, diet_tag, image_url, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            title, description, JSON.stringify(ingredients), instructions, 
            calories, protein, carbs, fat, diet_tag, image_url, req.userId
        ];

        const [result] = await db.query(query, values);
        res.status(201).json({ message: "Recipe created successfully", recipeId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create recipe", error: error.message });
    }
};

exports.deleteRecipe = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM recipes WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        res.json({ message: "Recipe deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
