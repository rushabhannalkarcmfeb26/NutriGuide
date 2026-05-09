const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function initDB() {
    try {
        console.log('Connecting to MySQL...');
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'cdac',
            multipleStatements: true
        });

        console.log('Connected! Reading SQL script...');
        const sqlPath = path.join(__dirname, 'db_setup.sql');
        const sqlScript = fs.readFileSync(sqlPath, 'utf8');

        console.log('Executing SQL script...');
        await connection.query(sqlScript);

        console.log('Database and tables initialized successfully!');
        
        // Let's insert an admin user if not exists
        await connection.query('USE nutriguide;');
        const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', ['admin@nutriguide.com']);
        if (rows.length === 0) {
            const bcrypt = require('bcryptjs');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            
            await connection.query(
                'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                ['Admin User', 'admin@nutriguide.com', hashedPassword, 'admin']
            );
            console.log('Admin user created (admin@nutriguide.com / admin123)');
        }

        await connection.end();
    } catch (err) {
        console.error('Error initializing database:', err);
    }
}

initDB();
