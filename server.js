const express = require('express');
const multer = require('multer');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs'); // Make sure bcryptjs is installed
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware
app.use(cors({ origin: 'http://localhost:3000' })); // Allow requests from frontend
app.use(express.json());

const SECRET_KEY = process.env.SECRET_KEY;


// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'C:/Users/kevin/OneDrive/RECIPE APP/recipe-app/src/uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`) // Use unique filenames
});
const upload = multer({ storage });

// MongoDB Atlas URI and Client
const mongoURI = "mongodb+srv://admin:strathmoreqrcode@cluster0.60o6t.mongodb.net/recipeWebsiteDB?retryWrites=true&w=majority";
const client = new MongoClient(mongoURI);

// Connect to MongoDB and return the DB instance
async function connectToDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');
        return client.db("recipeWebsiteDB"); // Return the DB instance
    } catch (err) {
        console.error('Error connecting to MongoDB Atlas:', err);
        process.exit(1); // Exit if database connection fails
    }
}

// Function to hash existing passwords
async function hashExistingPasswords() {
    const db = await connectToDB(); // Ensure db is connected before accessing
    const usersCollection = db.collection("users");
    const users = await usersCollection.find({}).toArray();

    for (const user of users) {
        // Skip users whose passwords are already hashed
        if (!user.password || user.password.startsWith('$2a$')) {
            continue;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(user.password, 10);
        
        // Update the user's password in the database with the hashed password
        await usersCollection.updateOne(
            { _id: new ObjectId(user._id) },
            { $set: { password: hashedPassword } } // Make sure the correct field is being updated
        );

        console.log(`Password hashed for user ID: ${user._id}`);
    }
}

// Call the function to hash existing passwords
hashExistingPasswords().catch(console.error);

// POST route for login
app.post('/login', async (req, res) => {
    const { email, password } = req.body; // email and password are expected in the request body
  
    // Validate if both email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Both email and password are required." });
    }
  
    try {
      const db = await connectToDB();
      const usersCollection = db.collection("users");
  
      // Find the user by email
      const user = await usersCollection.findOne({ email: email });
  
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      // Compare the entered password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials." });
      }
  
      // Successfully logged in
      res.status(200).json({
        message: "Login successful.",
        user: {
          _id: user._id,
          fname: user.fname,
          lname: user.lname,
          email: user.email, 
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Server error. Please try again later." });
    }
  });

  app.post('/register', async (req, res) => {
    const { email, fname, lname, password } = req.body;
  
    if (!fname || !lname || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    try {
      const db = await connectToDB();
      const usersCollection = db.collection('users');
  
      // Check if email already exists
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists.' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user object
      const newUser = {
        email,
        fname,
        lname,
        password: hashedPassword,
        role: 'user',  // Default role, can be changed if needed
      };
  
      // Insert the new user into the database
      await usersCollection.insertOne(newUser);
  
      res.status(201).json({ message: 'Signup successful!' });
    } catch (error) {
      console.error('Error during signup:', error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  });
  
  
// Route to handle recipe submission
app.post('/api/addRecipes', upload.single('recipeImage'), async (req, res) => {
    const { recipeName, ingredients, prepTime, instructions, recipeOwner } = req.body;
    const recipeImage = req.file ? req.file.filename : null;

    const newRecipe = {
        name: recipeName,
        ingredients: ingredients.split(','), // Convert comma-separated string to array
        prepTime,
        instructions: instructions.split(','), // Convert comma-separated string to array
        owner: recipeOwner,
        image: recipeImage,
        createdAt: new Date()
    };

    try {
        const result = await db.collection('recipes').insertOne(newRecipe);
        res.status(200).json({ message: 'Recipe submitted successfully', recipeId: result.insertedId });
    } catch (err) {
        console.error('Error saving recipe:', err);
        res.status(500).json({ error: 'Error saving recipe' });
    }
});

// Route to fetch all recipes
app.get('/api/recipes', async (req, res) => {
    try {
        const db= await connectToDB();
        const recipes = await db.collection('recipes').find().toArray();
        res.json(recipes);
    } catch (err) {
        console.error('Error fetching recipes:', err);
        res.status(500).json({ error: 'Error fetching recipes' });
    }
});

// Start server after connecting to MongoDB
const PORT = process.env.PORT || 4000;
connectToDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
    console.error('Failed to start server:', err);
});
