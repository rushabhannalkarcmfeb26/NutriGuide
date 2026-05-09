const mysql = require('mysql2/promise');

async function setup() {
    // Connect as root (original working credentials)
    let conn;
    const rootConfigs = [
        { user: 'root', password: 'cdac' },
        { user: 'root', password: '' },
        { user: 'cdac', password: 'cdac' },
    ];

    for (const creds of rootConfigs) {
        try {
            conn = await mysql.createConnection({
                host: 'localhost',
                user: creds.user,
                password: creds.password,
            });
            console.log(`✅ Connected as ${creds.user}`);
            break;
        } catch (e) {
            console.log(`❌ Failed as ${creds.user}: ${e.message}`);
        }
    }

    if (!conn) {
        console.error('Could not connect to MySQL with any credentials. Check your MySQL service.');
        process.exit(1);
    }

    try {
        // Create database
        await conn.query(`CREATE DATABASE IF NOT EXISTS nutriguide`);
        console.log('✅ Database "nutriguide" ready');

        // Create cdac user if not exists and grant access
        await conn.query(`CREATE USER IF NOT EXISTS 'cdac'@'localhost' IDENTIFIED BY 'cdac'`);
        await conn.query(`GRANT ALL PRIVILEGES ON nutriguide.* TO 'cdac'@'localhost'`);
        await conn.query(`FLUSH PRIVILEGES`);
        console.log('✅ User "cdac" created and granted access');

        await conn.query(`USE nutriguide`);

        // Create users table
        await conn.query(`
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
        console.log('✅ Table "users" ready');

        // Create recipes table
        await conn.query(`
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
        console.log('✅ Table "recipes" ready');

        // Create meal_logs table
        await conn.query(`
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
        console.log('✅ Table "meal_logs" ready');

        console.log('\n🎉 Database setup complete! You can now run: npm run dev');
    } catch (err) {
        console.error('Setup error:', err.message);
    } finally {
        await conn.end();
    }
}

setup();
