const express = require('express');
const multer = require('multer');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

const SECRET_KEY = process.env.SECRET_KEY;

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'C:/Users/kevin/OneDrive/RECIPE APP/recipe-app/src/uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// MongoDB Atlas URI and Client
const mongoURI = "mongodb+srv://admin:strathmoreqrcode@cluster0.60o6t.mongodb.net/recipeWebsiteDB?retryWrites=true&w=majority";
const client = new MongoClient(mongoURI);

// Connect to MongoDB
async function connectToDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');
        return client.db("recipeWebsiteDB");
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    }
}

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    console.log('Token received from client:', token);
    if (!token) {
        return res.status(401).json({ message: 'Token is missing. Authorization denied.' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }
        console.log('Decoded token payload:', user);
        req.user = user; // Attach user details to request
        next();
    });
}
// Route to fetch all users (secure)
app.get('/api/users', authenticateToken, async (req, res) => {
    try {
        const db = await connectToDB();
        const users = await db.collection('users').find().toArray();
        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Error fetching users.' });
    }
});

// Route to fetch a user's details by email or ID (secure)
app.get('/api/users/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const db = await connectToDB();
        const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ message: 'Error fetching user.' });
    }
});

// Route to fetch users by gender (secure)
app.get('/api/users/gender/:gender', authenticateToken, async (req, res) => {
    const { gender } = req.params;

    try {
        const db = await connectToDB();
        const users = await db.collection('users').find({ gender }).toArray();
        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching users by gender:', err);
        res.status(500).json({ message: 'Error fetching users by gender.' });
    }
});


// POST route for login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Both email and password are required.' });
    }

    try {
        const db = await connectToDB();
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            SECRET_KEY,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        res.status(200).json({
            message: 'Login successful.',
            token,
            user: { _id: user._id, fname: user.fname, lname: user.lname, email: user.email }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// POST route for register
app.post('/register', async (req, res) => {
    const { email, fname, lname, password, gender } = req.body;

    if (!fname || !lname || !email || !password || !gender) {
        return res.status(400).json({ message: 'All fields, including gender, are required.' });
    }

    const validGenders = ['male', 'female', 'non-binary', 'other', 'prefer not to say'];
    if (!validGenders.includes(gender.toLowerCase())) {
        return res.status(400).json({ message: 'Invalid gender value.' });
    }

    try {
        const db = await connectToDB();
        const usersCollection = db.collection('users');

        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { email, fname, lname, password: hashedPassword, gender: gender.toLowerCase(), role: 'user' };

        await usersCollection.insertOne(newUser);
        res.status(201).json({ message: 'Signup successful!' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});


// Route to add recipes (authenticated)
app.post('/api/addRecipes', authenticateToken, upload.single('recipeImage'), async (req, res) => {
    const { recipeName, ingredients, prepTime, cookingTime, instructions, cuisine, description, dietType,recipeCategory } = req.body;
    console.log('Incoming Recipe Data:', req.body); // Debugging

    console.log('Uploaded File:', req.file); // Debugging

  

    // Ensure ingredients and instructions are arrays
    const ingredientArray = Array.isArray(ingredients) ? ingredients : ingredients.split(',');
    const instructionArray = Array.isArray(instructions) ? instructions : instructions.split(',');

    const newRecipe = {
        name: recipeName,
        ingredients: ingredientArray, // Ensure ingredients is an array
        prepTime,
        cookingTime,
        instructions: instructionArray, // Ensure instructions is an array
        cuisine,
        description,
        dietType,
        recipeCategory,
        owner: req.user.id, // Use authenticated user's ID
        createdAt: new Date()
    };

    try {
        const db = await connectToDB();
        const result = await db.collection('recipes').insertOne(newRecipe);
        if (!result.acknowledged) {
            return res.status(500).json({ message: 'Failed to insert recipe.' });
        }
        res.status(201).json({ message: 'Recipe submitted successfully', recipeId: result.insertedId });
    } catch (err) {
        console.error('Error saving recipe:', err);
        res.status(500).json({ message: 'Error saving recipe.' });
    }
});

// Route to fetch all recipes
app.get('/api/recipes', async (req, res) => {
    try {
        const db = await connectToDB();
        const recipes = await db.collection('recipes').find().toArray();
        res.json(recipes);
    } catch (err) {
        console.error('Error fetching recipes:', err);
        res.status(500).json({ message: 'Error fetching recipes.' });
    }
});
// Route to fetch all recipes or filter by dietType
app.get('/api/recipes', async (req, res) => {
    const { dietType } = req.query;  // Get the dietType from query parameters

    try {
        const db = await connectToDB();
        let query = {};
        
        // If dietType is provided, filter recipes by dietType
        if (dietType) {
            query.dietType = dietType;
        }

        // Fetch recipes based on the query (either all or filtered by dietType)
        const recipes = await db.collection('recipes').find(query).toArray();
        res.json(recipes);
    } catch (err) {
        console.error('Error fetching recipes:', err);
        res.status(500).json({ message: 'Error fetching recipes.' });
    }
});

// Route to fetch recipes created by the logged-in user
app.get('/api/recipes/user', authenticateToken, async (req, res) => {
    console.log("User ID from token:", req.user.id); // Debugging the user ID
    const userId = req.user.id;

    try {
        const db = await connectToDB();
        const recipes = await db.collection('recipes').find({ owner: userId }).toArray();
        res.status(200).json(recipes);
    } catch (err) {
        console.error('Error fetching user recipes:', err);
        res.status(500).json({ message: 'Error fetching recipes.' });
    }
});
// Route to edit a recipe (authenticated, owner or admin)
app.put('/api/recipes/:id', authenticateToken, async (req, res) => {
    const { id } = req.params; // Recipe ID
    const userId = req.user.id; // Authenticated user ID
    const userRole = req.user.role; // User role (admin/user)

    // Fields that can be updated
    const { recipeName, ingredients, prepTime, cookingTime, instructions, cuisine, description, dietType, recipeCategory } = req.body;

    try {
        const db = await connectToDB();

        // Find the recipe by ID
        const recipe = await db.collection('recipes').findOne({ _id: new ObjectId(id) });

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found.' });
        }

        // Only the owner of the recipe or an admin can edit it
        if (recipe.owner.toString() !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to edit this recipe.' });
        }

        // Update the recipe
        const updatedRecipe = {
            name: recipeName || recipe.name,
            ingredients: Array.isArray(ingredients) ? ingredients : ingredients.split(','),
            prepTime: prepTime || recipe.prepTime,
            cookingTime: cookingTime || recipe.cookingTime,
            instructions: Array.isArray(instructions) ? instructions : instructions.split(','),
            cuisine: cuisine || recipe.cuisine,
            description: description || recipe.description,
            dietType: dietType || recipe.dietType,
            recipeCategory: recipeCategory || recipe.recipeCategory,
            updatedAt: new Date() // Add updatedAt field
        };

        await db.collection('recipes').updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedRecipe }
        );

        res.status(200).json({ message: 'Recipe updated successfully.' });
    } catch (err) {
        console.error('Error updating recipe:', err);
        res.status(500).json({ message: 'Error updating recipe.' });
    }
});

// Route to delete a recipe (authenticated, owner or admin)
app.delete('/api/recipes/:id', authenticateToken, async (req, res) => {
    const { id } = req.params; // Recipe ID
    const userId = req.user.id; // Authenticated user ID
    const userRole = req.user.role; // User role (admin/user)

    try {
        const db = await connectToDB();

        // Find the recipe by ID
        const recipe = await db.collection('recipes').findOne({ _id: new ObjectId(id) });

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found.' });
        }

        // Only the owner of the recipe or an admin can delete it
        if (recipe.owner.toString() !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to delete this recipe.' });
        }

        // Delete the recipe
        await db.collection('recipes').deleteOne({ _id: new ObjectId(id) });

        res.status(200).json({ message: 'Recipe deleted successfully.' });
    } catch (err) {
        console.error('Error deleting recipe:', err);
        res.status(500).json({ message: 'Error deleting recipe.' });
    }
});



// Route to fetch a single recipe by ID
app.get('/api/recipes/:id', async (req, res) => {
  const { id } = req.params;

  try {
      const db = await connectToDB();
      const recipe = await db.collection('recipes').findOne({ _id: new ObjectId(id) });

      if (!recipe) {
          return res.status(404).json({ message: 'Recipe not found' });
      }

      res.status(200).json(recipe);
  } catch (err) {
      console.error('Error fetching recipe:', err);
      res.status(500).json({ message: 'Error fetching recipe.' });
  }
});

app.post('/api/recipes/:id/comments', authenticateToken, async (req, res) => {
    const { id } = req.params; // Recipe ID
    const { comment } = req.body; // Comment text
    const userId = req.user.id; // Authenticated user ID

    // Validate the comment text
    if (!comment) {
        return res.status(400).json({ message: 'Comment text is required.' });
    }

    try {
        const db = await connectToDB();
        const recipe = await db.collection('recipes').findOne({ _id: new ObjectId(id) });

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found.' });
        }

        // Ensure `comments` is an array before operating on it
        if (!Array.isArray(recipe.comments)) {
            recipe.comments = []; // Initialize as an empty array if it doesn't exist
        }

        const newComment = {
            userId,
            comment,
            createdAt: new Date()
        };

        // Add the new comment to the `comments` array
        await db.collection('recipes').updateOne(
            { _id: new ObjectId(id) },
            { $push: { comments: newComment } }
        );

        res.status(201).json({ message: 'Comment added successfully.' });
    } catch (err) {
        console.error('Error adding comment:', err);
        res.status(500).json({ message: 'Error adding comment.' });
    }
});

app.post('/api/recipes/:id/ratings', authenticateToken, async (req, res) => {
    const { id } = req.params; // Recipe ID
    const { rating } = req.body; // Rating value
    const userId = req.user.id; // Authenticated user ID

    // Validate the rating value
    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    try {
        const db = await connectToDB();
        const recipe = await db.collection('recipes').findOne({ _id: new ObjectId(id) });

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found.' });
        }

        // Ensure `ratings` is an array before operating on it
        if (!Array.isArray(recipe.ratings)) {
            recipe.ratings = []; // Initialize as an empty array if it doesn't exist
        }

        const existingRatingIndex = recipe.ratings.findIndex(r => r.userId === userId);

        if (existingRatingIndex > -1) {
            // Update existing rating
            recipe.ratings[existingRatingIndex].rating = rating;
        } else {
            // Add new rating
            recipe.ratings.push({ userId, rating });
        }

        // Update the recipe with the new rating
        await db.collection('recipes').updateOne(
            { _id: new ObjectId(id) },
            { $set: { ratings: recipe.ratings } }
        );

        res.status(201).json({ message: 'Rating added/updated successfully.' });
    } catch (err) {
        console.error('Error adding rating:', err);
        res.status(500).json({ message: 'Error adding rating.' });
    }
});

app.get('/api/recipes/:id/comments-ratings', async (req, res) => {
    const { id } = req.params; // Recipe ID

    try {
        const db = await connectToDB();
        const recipe = await db.collection('recipes').findOne({ _id: new ObjectId(id) });

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found.' });
        }

        const comments = recipe.comments || [];
        const ratings = recipe.ratings || [];
        const averageRating =
            ratings.length > 0
                ? (ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length).toFixed(1)
                : null;

        res.status(200).json({ comments, averageRating });
    } catch (err) {
        console.error('Error fetching comments and ratings:', err);
        res.status(500).json({ message: 'Error fetching comments and ratings.' });
    }
});



// Start server
const PORT = process.env.PORT || 4000;
connectToDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
    console.error('Failed to start server:', err);
});
