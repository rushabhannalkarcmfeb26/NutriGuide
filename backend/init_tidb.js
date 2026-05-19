const db = require('./config/db');
const bcrypt = require('bcryptjs');

async function initTidb() {
    try {
        console.log('🔄 Connecting to TiDB Cloud and creating tables...');

        // 1. Create Users Table
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('user', 'admin') DEFAULT 'user',
                age INT,
                weight FLOAT,
                height FLOAT,
                diet_preference ENUM('none', 'vegan', 'vegetarian', 'non-vegetarian') DEFAULT 'none',
                health_goal ENUM('lose_weight', 'maintain', 'gain_muscle') DEFAULT 'maintain',
                allergies TEXT,
                target_weight FLOAT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Users table created or verified.');

        // 2. Create Recipes Table
        await db.query(`
            CREATE TABLE IF NOT EXISTS recipes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                ingredients JSON NOT NULL,
                instructions TEXT NOT NULL,
                calories INT NOT NULL,
                protein INT NOT NULL,
                carbs INT NOT NULL,
                fat INT NOT NULL,
                diet_tag VARCHAR(50),
                image_url VARCHAR(500),
                created_by INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
            )
        `);
        console.log('✅ Recipes table created or verified.');

        // 3. Create Meal Logs Table
        await db.query(`
            CREATE TABLE IF NOT EXISTS meal_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                recipe_id INT NOT NULL,
                date DATE NOT NULL,
                meal_type ENUM('breakfast', 'lunch', 'dinner', 'snack') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Meal logs table created or verified.');

        // 4. Create default Admin User if not exists
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', ['admin@nutriguide.com']);
        if (rows.length === 0) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            
            await db.query(
                'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                ['Admin User', 'admin@nutriguide.com', hashedPassword, 'admin']
            );
            console.log('✅ Admin user created (admin@nutriguide.com / admin123)');
        } else {
            console.log('ℹ️ Admin user already exists.');
        }

        console.log('\n🎉 TiDB Database initialization completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error initializing TiDB database:', err);
        process.exit(1);
    }
}

initTidb();
