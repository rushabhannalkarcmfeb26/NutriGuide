const jwt = require('jsonwebtoken');

async function test() {
    try {
        const token = jwt.sign({ id: 1, role: 'user' }, 'supersecretkey123', { expiresIn: '1h' });
        
        const res = await fetch('http://localhost:5000/api/auth/profile', {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Test Name',
                age: '25',
                weight: '',
                height: '180',
                diet_preference: 'vegan',
                health_goal: 'maintain'
            })
        });
        
        const data = await res.json();
        console.log("STATUS:", res.status);
        console.log("RESPONSE:", data);
    } catch (err) {
        console.error("ERROR:", err);
    }
}
test();
