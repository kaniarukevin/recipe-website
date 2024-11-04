const express = require('express');
const multer = require('multer');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'C:/Users/kevin/OneDrive/RECIPE APP/recipe-app/src/uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

// Setup MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pizanite@8',
    database: 'recipe_website'
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// Handle recipe submission
app.post('http://localhost:5000/api/recipes', upload.single('recipeImage'), (req, res) => {
    const { recipeName, ingredients,prepTime, instructions, recipeOwner } = req.body;
    const recipeImage = req.file ? req.file.filename : null;

    const query = `
        INSERT INTO recipes (name, ingredients,prepTime, instructions, owner, image)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [recipeName, ingredients,prepTime, instructions, recipeOwner, recipeImage], (err, result) => {
        if (err) {
            console.error('Error inserting recipe:', err);
            return res.status(500).send('Error saving recipe');
        }
        res.status(200).send('Recipe submitted successfully');
    });
});
app.get('http://localhost:5000/api/recipes', (req, res) => {
    db.query('SELECT * FROM recipes', (err, results) => {
        if (err) {
            console.error('Error Fetch', err);
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
