const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Load environment variables from the .env file in the backend folder
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const dbHost = process.env.DB_HOST || 'localhost';

// Read the SSL certificate if we are connecting to a remote TiDB database
let sslConfig = null;
const sslCertPathParent = path.join(__dirname, '../../isrgrootx1.pem');
const sslCertPathLocal = path.join(__dirname, '../isrgrootx1.pem');

let selectedCertPath = null;
if (fs.existsSync(sslCertPathLocal)) {
    selectedCertPath = sslCertPathLocal;
} else if (fs.existsSync(sslCertPathParent)) {
    selectedCertPath = sslCertPathParent;
}

if (dbHost !== 'localhost' && dbHost !== '127.0.0.1' && selectedCertPath) {
    sslConfig = {
        minVersion: 'TLSv1.2',
        ca: fs.readFileSync(selectedCertPath)
    };
}

const pool = mysql.createPool({
    host: dbHost,
    port: process.env.DB_PORT || (dbHost.includes('tidbcloud.com') ? 4000 : 3306),
    user: process.env.DB_USER || 'cdac',
    password: process.env.DB_PASSWORD || 'cdac',
    database: process.env.DB_NAME || 'nutriguide',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: sslConfig
});

module.exports = pool;

