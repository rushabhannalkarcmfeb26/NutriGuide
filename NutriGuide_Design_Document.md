# NutriGuide: Project Design & Implementation Guide

Welcome to the CDAC PGCP AC mini project guide for **NutriGuide**! As your mentor, I've structured this document to provide a clear, realistic, and implementable roadmap. We've balanced modern practices with the scope of a mini-project.

## 1. Project Overview

**Problem Statement:** 
Many individuals struggle to find meals that align with their specific health goals (e.g., weight loss, muscle gain) and dietary restrictions (e.g., vegan, gluten-free), making healthy eating difficult to sustain.

**Objectives:**
- Provide a platform where users can discover healthy recipes tailored to their profile.
- Enable users to track their daily meals and caloric intake.
- Provide administrators with tools to manage the recipe database.

**Key Features:**
- User Registration & Profiling (Age, Weight, Goal, Diet Preference).
- Personalized Recipe Recommendations.
- Daily Meal Tracking & Calorie Counting.
- Admin Panel for Recipe Management.

**Target Users:**
Health-conscious individuals, fitness beginners, and anyone looking for structured meal guidance.

---

## 2. System Architecture

**High-Level Architecture:**
NutriGuide follows a classic 3-tier Client-Server architecture:
1. **Presentation Layer (Frontend):** A Single Page Application (SPA) built with React.js. It handles routing, UI state, and user interactions.
2. **Application Layer (Backend):** A RESTful API built with Node.js and Express.js. It manages business logic, validation, and authentication.
3. **Data Layer (Database):** A MySQL relational database storing users, recipes, and meal logs.

**Interaction Flow:**
Client (React) -> HTTP Request (Axios) -> Server (Express API) -> Query (MySQL) -> Response (JSON) -> Client Updates UI.

---

## 3. Database Schema (MySQL)

Here are the core tables needed for the application.

### `users`
- `id` (INT, PK, Auto Increment)
- `name` (VARCHAR)
- `email` (VARCHAR, Unique)
- `password` (VARCHAR, Hashed)
- `role` (ENUM: 'user', 'admin')
- `age` (INT)
- `weight` (FLOAT)
- `height` (FLOAT)
- `diet_preference` (ENUM: 'none', 'vegan', 'vegetarian', 'keto')
- `health_goal` (ENUM: 'lose_weight', 'maintain', 'gain_muscle')

### `recipes`
- `id` (INT, PK, Auto Increment)
- `title` (VARCHAR)
- `description` (TEXT)
- `ingredients` (JSON or TEXT)
- `instructions` (TEXT)
- `calories` (INT)
- `protein` (INT) - in grams
- `carbs` (INT) - in grams
- `fat` (INT) - in grams
- `diet_tag` (VARCHAR) - matches `diet_preference`
- `image_url` (VARCHAR)

### `meal_logs`
- `id` (INT, PK, Auto Increment)
- `user_id` (INT, FK -> users.id)
- `recipe_id` (INT, FK -> recipes.id)
- `date` (DATE)
- `meal_type` (ENUM: 'breakfast', 'lunch', 'dinner', 'snack')

---

## 4. Backend (Node.js + Express)

### Folder Structure
```text
backend/
├── config/         # Database connection (db.js)
├── controllers/    # Request handlers (userController.js, recipeController.js)
├── middlewares/    # Custom middlewares (auth.js, validate.js)
├── routes/         # Express routes (userRoutes.js, recipeRoutes.js)
├── utils/          # Helpers (jwtHelpers.js, passHash.js)
├── server.js       # Entry point
└── package.json
```

### REST API Design
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Authenticate and return JWT
- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/recommendations` - Get recipes based on user profile
- `POST /api/recipes` - (Admin only) Create recipe
- `GET /api/meals` - Get user's meal logs for today
- `POST /api/meals` - Add a recipe to meal logs

---

## 5. Frontend (React.js)

### Folder Structure
```text
frontend/
├── src/
│   ├── assets/       # Images, global CSS
│   ├── components/   # Reusable UI (Navbar.jsx, RecipeCard.jsx, Button.jsx)
│   ├── pages/        # Route components (Login.jsx, Dashboard.jsx, AdminPanel.jsx)
│   ├── context/      # React Context (AuthContext.jsx)
│   ├── services/     # API calls (api.js)
│   ├── App.jsx       # Main component & Routes
│   └── main.jsx      # Entry point
```

### Pages
- **Login/Register:** Form with validation.
- **Dashboard:** Shows daily calorie progress, recommended recipes, and recent meals.
- **Recipe Explorer:** Search and filter all recipes.
- **Admin Panel:** Table showing all recipes with Add/Edit/Delete buttons.

### State Management
Use **React Context API** (`AuthContext`) to store the logged-in user's details and JWT token globally.

---

## 6. Role-Based Access Control (RBAC)

**Implementation:**
The JWT token issued upon login will contain `{ id: 1, role: 'admin' }`.

- **Backend:** `isAdmin` middleware checks the decoded token. If `role !== 'admin'`, return `403 Forbidden`.
- **Frontend:** The `AuthContext` exposes `user.role`. 
  - If `role === 'admin'`, show "Admin Panel" in the Navbar.
  - Protect the `/admin` route using a `<ProtectedRoute>` component that redirects non-admins to `/dashboard`.

---

## 7. Project-Specific Functionalities

### A. Personalized Recommendation Logic
Instead of complex Machine Learning, use a rule-based algorithm suitable for a mini-project:
1. Fetch user's `diet_preference` and `health_goal`.
2. Determine target daily calories (e.g., Lose weight = 1500 kcal, Gain = 2500 kcal).
3. Query the database: `SELECT * FROM recipes WHERE diet_tag = ? AND calories <= ?`
4. Return these customized recipes to the user's dashboard.

### B. Calorie Tracker / Meal Planner
1. User clicks "Add to Tracker" on a recipe.
2. Frontend sends `POST /api/meals` with `recipe_id` and `meal_type` (e.g., Breakfast).
3. On the Dashboard, query `GET /api/meals?date=YYYY-MM-DD`.
4. Calculate total calories consumed = Sum of calories from fetched meal logs. Compare this to the user's daily goal using a simple progress bar UI.

---

## 8. API Integration (Bonus)

**Suggested API:** **Spoonacular Nutrition API** (Free Tier available).
**Use Case:** If an Admin is adding a new recipe, instead of manually typing calories and macros, they can type the ingredients, and you call Spoonacular to calculate the total nutrition facts automatically.

**Integration Example (Backend Service):**
```javascript
const axios = require('axios');

async function getNutrition(ingredientList) {
  const apiKey = 'YOUR_SPOONACULAR_API_KEY';
  const response = await axios.post(
    `https://api.spoonacular.com/recipes/parseIngredients?apiKey=${apiKey}`,
    { ingredientList, servings: 1 }
  );
  return response.data; // Contains parsed calories, protein, etc.
}
```

---

## 9. Validation Strategy

- **Frontend:** Use controlled components in React. Check for empty fields, valid email format (using Regex), and password length before allowing form submission. Show red error text below invalid fields.
- **Backend:** Never trust frontend data. Use a library like `express-validator` on your routes to ensure SQL Injection is prevented and data integrity is maintained.

---

## 10. Testing

- **Backend:** Use **Postman** to create a collection of all your endpoints. Test invalid logins, unauthorized access to admin routes, and successful CRUD operations.
- **Frontend:** Manually test responsiveness using Chrome DevTools (Mobile View). Test form edge cases (submitting empty forms).

---

## 11. Code Snippets

### A. Authentication (Login - Backend)

**`controllers/authController.js`**
```javascript
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // MySQL connection pool

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(404).json({ message: "User not found" });

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        // Generate Token
        const token = jwt.sign({ id: user.id, role: user.role }, 'YOUR_SECRET_KEY', { expiresIn: '1h' });

        res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
```

### B. CRUD Module (Create Recipe - Backend)

**`routes/recipeRoutes.js`**
```javascript
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken, isAdmin } = require('../middlewares/auth');

// Protected Admin Route
router.post('/', verifyToken, isAdmin, async (req, res) => {
    const { title, description, calories, diet_tag } = req.body;
    try {
        const query = 'INSERT INTO recipes (title, description, calories, diet_tag) VALUES (?, ?, ?, ?)';
        const [result] = await db.query(query, [title, description, calories, diet_tag]);
        res.status(201).json({ message: "Recipe created successfully", recipeId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: "Failed to create recipe", error });
    }
});

module.exports = router;
```

### C. React Form with Validation (Frontend)

**`pages/Login.jsx`**
```jsx
import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic Frontend Validation
        if (!formData.email.includes('@')) {
            return setError('Please enter a valid email.');
        }
        if (formData.password.length < 6) {
            return setError('Password must be at least 6 characters.');
        }

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', formData);
            localStorage.setItem('token', response.data.token);
            // Redirect to Dashboard...
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <input 
                type="email" 
                placeholder="Email" 
                value={formData.email} 
                onChange={e => setFormData({ ...formData, email: e.target.value })} 
                required 
            />
            
            <input 
                type="password" 
                placeholder="Password" 
                value={formData.password} 
                onChange={e => setFormData({ ...formData, password: e.target.value })} 
                required 
            />
            
            <button type="submit">Log In</button>
        </form>
    );
};

export default Login;
```

---

### Mentor's Advice for Execution:
1. **Database First:** Setup MySQL, create the tables, and insert some dummy recipes directly via SQL to have data to work with.
2. **Backend APIs Next:** Build and test your Express routes using Postman before touching React.
3. **Connect Frontend:** Build basic React components, connect them to your APIs using Axios, and implement the AuthContext.
4. **Polish:** Add CSS, ensure responsive design, and refine error handling.
