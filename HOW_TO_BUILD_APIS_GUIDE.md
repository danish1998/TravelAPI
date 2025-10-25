# How to Build APIs - Complete Guide
## Learning from the Favorites API Implementation

This guide will teach you how to build REST APIs like the Favorites API we just created. You'll learn the patterns, structure, and best practices.

## 📚 Table of Contents
1. [API Architecture Overview](#api-architecture-overview)
2. [Step-by-Step Implementation](#step-by-step-implementation)
3. [Key Concepts Explained](#key-concepts-explained)
4. [Code Patterns and Best Practices](#code-patterns-and-best-practices)
5. [How to Create Your Own APIs](#how-to-create-your-own-apis)
6. [Common Patterns and Examples](#common-patterns-and-examples)

---

## 🏗️ API Architecture Overview

### The MVC Pattern in APIs
```
Request → Routes → Controller → Service/Model → Database
Response ← Routes ← Controller ← Service/Model ← Database
```

**What each layer does:**
- **Routes**: Define URL endpoints and HTTP methods
- **Controller**: Handle business logic and request/response
- **Model**: Define data structure and database operations
- **Middleware**: Authentication, validation, error handling

---

## 🛠️ Step-by-Step Implementation

### Step 1: Create the Data Model (MongoDB Schema)

```javascript
// Models/Favourites.js
const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  favorites: [
    {
      id: { type: String, required: true },
      name: String,
      type: String,
      // ... other fields
    },
  ],
});

module.exports = mongoose.model("Favorite", favoriteSchema);
```

**Key Learning Points:**
- **Schema Definition**: Define the structure of your data
- **Data Types**: String, Number, ObjectId, Array, etc.
- **Validation**: `required: true` ensures data integrity
- **References**: `ref: "User"` creates relationship between collections
- **Nested Arrays**: `favorites: [...]` allows multiple items per user

### Step 2: Create the Controller (Business Logic)

```javascript
// Controllers/favoritesController.js
const Favorite = require("../Models/Favourites");

const addToFavorites = async (req, res) => {
  try {
    // 1. Extract data from request
    const { userId } = req.user; // From JWT middleware
    const favoriteData = req.body;

    // 2. Validate input
    if (!favoriteData.id || !favoriteData.type) {
      return res.status(400).json({
        success: false,
        message: "Item ID and type are required"
      });
    }

    // 3. Check if user has favorites document
    let userFavorites = await Favorite.findOne({ userId });

    // 4. Create new document if doesn't exist
    if (!userFavorites) {
      userFavorites = new Favorite({
        userId,
        favorites: []
      });
    }

    // 5. Check for duplicates
    const existingFavorite = userFavorites.favorites.find(
      fav => fav.id === favoriteData.id && fav.type === favoriteData.type
    );

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: "Item already exists in favorites"
      });
    }

    // 6. Add new item
    userFavorites.favorites.push(favoriteData);
    await userFavorites.save();

    // 7. Send response
    res.status(201).json({
      success: true,
      message: "Item added to favorites successfully",
      data: {
        favoriteId: favoriteData.id,
        totalFavorites: userFavorites.favorites.length
      }
    });

  } catch (error) {
    // 8. Handle errors
    console.error("Error adding to favorites:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong"
    });
  }
};
```

**Key Learning Points:**
- **Error Handling**: Always wrap in try-catch
- **Validation**: Check required fields before processing
- **Database Operations**: `findOne()`, `save()`, `find()`
- **Response Structure**: Consistent success/error format
- **Status Codes**: 200 (success), 201 (created), 400 (bad request), 500 (server error)

### Step 3: Create Routes (URL Endpoints)

```javascript
// routes/favorites-routes.js
const express = require("express");
const {
  addToFavorites,
  getFavorites,
  removeFromFavorites
} = require("../Controllers/favoritesController");
const { asyncHandler } = require("../middleware/ErrorHandler");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// All routes require authentication
router.use(verifyToken());

// Define endpoints
router.post("/", asyncHandler(addToFavorites));           // POST /api/v1/favorites
router.get("/", asyncHandler(getFavorites));              // GET /api/v1/favorites
router.delete("/:id/:type", asyncHandler(removeFromFavorites)); // DELETE /api/v1/favorites/123/product

module.exports = router;
```

**Key Learning Points:**
- **HTTP Methods**: POST (create), GET (read), PUT (update), DELETE (delete)
- **URL Parameters**: `:id/:type` captures values from URL
- **Middleware**: `verifyToken()` for authentication, `asyncHandler()` for error handling
- **Route Organization**: Group related endpoints in one file

### Step 4: Connect Routes to Server

```javascript
// server.js
const favoritesRouter = require("./routes/favorites-routes");

// Add to server
app.use("/api/v1/favorites", favoritesRouter);
```

**Key Learning Points:**
- **Route Mounting**: `app.use()` connects routes to server
- **URL Prefix**: `/api/v1/favorites` becomes the base URL
- **Versioning**: `/api/v1/` allows for API versioning

---

## 🔑 Key Concepts Explained

### 1. Middleware Pattern

```javascript
// Middleware runs between request and response
app.use(express.json());                    // Parse JSON bodies
app.use(verifyToken());                    // Authentication
app.use(asyncHandler(controllerFunction)); // Error handling
```

**Types of Middleware:**
- **Application-level**: Runs for all requests
- **Route-level**: Runs for specific routes
- **Error-handling**: Catches and processes errors

### 2. Authentication Flow

```javascript
// middleware/auth.js
const verifyToken = () => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Add user info to request
      next(); // Continue to next middleware/controller
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
};
```

### 3. Error Handling Pattern

```javascript
// middleware/ErrorHandler.js
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Global error handler
const globalErrorhandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
};
```

### 4. Database Operations

```javascript
// Common MongoDB operations
const user = await User.findById(userId);                    // Find by ID
const users = await User.find({ status: 'active' });          // Find multiple
const newUser = await User.create(userData);                 // Create new
const updated = await User.findByIdAndUpdate(id, data);      // Update
const deleted = await User.findByIdAndDelete(id);             // Delete
const count = await User.countDocuments({ status: 'active' }); // Count
```

---

## 🚀 How to Create Your Own APIs

### Template for Any New API

#### 1. Create the Model
```javascript
// Models/YourModel.js
const mongoose = require("mongoose");

const yourSchema = new mongoose.Schema({
  // Define your fields here
  name: { type: String, required: true },
  description: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  // Add timestamps
}, { timestamps: true });

module.exports = mongoose.model("YourModel", yourSchema);
```

#### 2. Create the Controller
```javascript
// Controllers/yourController.js
const YourModel = require("../Models/YourModel");

const createItem = async (req, res) => {
  try {
    const { userId } = req.user;
    const itemData = req.body;
    
    // Validation
    if (!itemData.name) {
      return res.status(400).json({
        success: false,
        message: "Name is required"
      });
    }
    
    // Create item
    const newItem = await YourModel.create({
      ...itemData,
      userId
    });
    
    res.status(201).json({
      success: true,
      message: "Item created successfully",
      data: newItem
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

const getItems = async (req, res) => {
  try {
    const { userId } = req.user;
    const { page = 1, limit = 10 } = req.query;
    
    const items = await YourModel.find({ userId })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await YourModel.countDocuments({ userId });
    
    res.json({
      success: true,
      data: items,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching items",
      error: error.message
    });
  }
};

module.exports = { createItem, getItems };
```

#### 3. Create the Routes
```javascript
// routes/yourRoutes.js
const express = require("express");
const { createItem, getItems } = require("../Controllers/yourController");
const { asyncHandler } = require("../middleware/ErrorHandler");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// Apply authentication to all routes
router.use(verifyToken());

// Define your endpoints
router.post("/", asyncHandler(createItem));    // POST /api/v1/your-endpoint
router.get("/", asyncHandler(getItems));       // GET /api/v1/your-endpoint

module.exports = router;
```

#### 4. Add to Server
```javascript
// server.js
const yourRouter = require("./routes/yourRoutes");

app.use("/api/v1/your-endpoint", yourRouter);
```

---

## 📋 Common Patterns and Examples

### 1. CRUD Operations Template

```javascript
// Complete CRUD controller template
const YourModel = require("../Models/YourModel");

// CREATE
const create = async (req, res) => {
  try {
    const item = await YourModel.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// READ (Get All)
const getAll = async (req, res) => {
  try {
    const items = await YourModel.find();
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// READ (Get One)
const getOne = async (req, res) => {
  try {
    const item = await YourModel.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE
const update = async (req, res) => {
  try {
    const item = await YourModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE
const remove = async (req, res) => {
  try {
    const item = await YourModel.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }
    res.json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { create, getAll, getOne, update, remove };
```

### 2. Search and Filtering

```javascript
const searchItems = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    // Build query object
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.category = category;
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    // Execute query with sorting
    const items = await YourModel.find(query)
      .sort({ [sortBy]: order })
      .limit(20);
    
    res.json({
      success: true,
      data: items,
      filters: { search, category, minPrice, maxPrice, sortBy, order }
    });
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

### 3. Pagination Pattern

```javascript
const getPaginatedItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const items = await YourModel.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await YourModel.countDocuments();
    const totalPages = Math.ceil(total / limit);
    
    res.json({
      success: true,
      data: items,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

---

## 🎯 Best Practices Summary

### 1. **Always Use Try-Catch**
```javascript
try {
  // Your code here
} catch (error) {
  res.status(500).json({ success: false, message: error.message });
}
```

### 2. **Validate Input Data**
```javascript
if (!req.body.name) {
  return res.status(400).json({
    success: false,
    message: "Name is required"
  });
}
```

### 3. **Use Consistent Response Format**
```javascript
// Success response
res.json({
  success: true,
  message: "Operation successful",
  data: result
});

// Error response
res.status(400).json({
  success: false,
  message: "Error description",
  error: errorDetails
});
```

### 4. **Use Middleware for Common Tasks**
```javascript
// Authentication
router.use(verifyToken());

// Rate limiting
router.use(rateLimiter);

// Validation
router.use(validateInput);
```

### 5. **Handle Database Errors**
```javascript
try {
  const item = await Model.findById(id);
  if (!item) {
    return res.status(404).json({ success: false, message: "Not found" });
  }
} catch (error) {
  if (error.name === 'CastError') {
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }
  throw error;
}
```

---

## 🚀 Quick Start Checklist

When creating a new API:

1. ✅ **Create Model** - Define data structure
2. ✅ **Create Controller** - Business logic
3. ✅ **Create Routes** - URL endpoints
4. ✅ **Add to Server** - Connect routes
5. ✅ **Add Authentication** - Protect endpoints
6. ✅ **Add Validation** - Check input data
7. ✅ **Add Error Handling** - Handle errors gracefully
8. ✅ **Test Endpoints** - Verify everything works
9. ✅ **Add Documentation** - Document your API

---

## 📖 Learning Resources

- **Express.js**: Web framework for Node.js
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **REST API**: Representational State Transfer
- **HTTP Methods**: GET, POST, PUT, DELETE
- **Status Codes**: 200, 201, 400, 401, 404, 500

This guide gives you the foundation to build any API. Start with simple CRUD operations and gradually add more complex features like authentication, validation, and advanced queries.
