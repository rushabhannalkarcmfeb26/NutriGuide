const db = require('./config/db');
db.query("ALTER TABLE users MODIFY COLUMN diet_preference VARCHAR(50) DEFAULT 'none'")
  .then(() => db.query("UPDATE users SET diet_preference = 'non-vegetarian' WHERE diet_preference = 'keto'"))
  .then(() => db.query("ALTER TABLE users MODIFY COLUMN diet_preference ENUM('none','vegan','vegetarian','non-vegetarian') DEFAULT 'none'"))
  .then(() => { console.log('users.diet_preference ENUM updated successfully'); process.exit(0); })
  .catch(e => { console.error('Error:', e.message); process.exit(1); });
