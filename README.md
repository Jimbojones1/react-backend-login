## Project Overview

You are going to create an express API that has JWT Authentication implememented.

#### Tech requirements

- express
- jsonwebtoken
- mongoose
- mongodb
- dotenv
- prefer the function keyword
- use async/await

#### Routes requirements

Login / Signup
POST /login and POST /signup → Auth flow for creators only.
On success, redirect to /dashboard
Protect /dashboard and recipe CRUD routes with auth guard.

Create Recipe
POST /recipes → Accessible from /dashboard
Form inputs: title, image, ingredients, instructions
Validate → Submit → Show success toast/modal
Update UI without reload

Update Recipe
PATCH /recipes/:id → Click "Edit" on a dashboard item
Prefill form with existing data
On submit: update, show success, refresh list

Delete Recipe
DELETE /recipes/:id → Button in dashboard
Confirm dialog → On accept, delete and update UI
Handle edge cases (404, permission errors)

Browse + Search Recipes
GET /recipes → Publicly accessible
List + Search input
Query by title/tag/ingredient
Click recipe card → route to GET /recipes/:id

<hr />

#### DATA MODEL

"title": "Spicy Chickpea Stew",
"description": "A hearty vegan dish with chickpeas and tomatoes.",
"ingredients": ["1 tbsp olive oil", "1 onion", "2 cloves garlic", "1 can chickpeas", "1 can diced tomatoes", "1 tsp cumin", "1/2 tsp chili flakes", "Salt to taste"],
"instructions": ["Sauté onions and garlic.", "Add chickpeas and tomatoes.", "Simmer for 20 minutes."],
"tags": ["vegan", "gluten-free", "dinner"], // examples <- can be user generated
"author": "Gaya Patel",
"ownerId": "1838223",
"createdAt": "2025-07-25T12:00:00Z",
"updatedAt": "2025-07-25T12:30:00Z"

The ingrediants and instructions can be created as subdocuments to the main recipe model.

### Model relationship

- One recipe has many ingrediants, ingrediant belongs to recipe
- Recipe has many instructions, instruction belong to the recipe

### User Stories

User Stories [Recipe Management & Discovery]
Recipe Management
User Story 1: Create a Recipe
As a recipe creator, I want to add new recipes so I can store and share them.

**Acceptance Criteria:**

Form includes title, image, ingredients, and instructions

Required field validation

Success message on submission

User Story 2: View Recipes
As any user, I want to view a list of recipes so I can find something to cook.

**Acceptance Criteria:**

Recipe cards show key info

Click to open full recipe

Works for both logged-in and guest users
User Story 3: Edit a Recipe
As a creator, I want to edit my recipe so I can fix or improve it.

Acceptance Criteria:

"Edit" button appears on creator dashboard

Prefilled form loads existing data

Save updates the recipe
User Story 4: Delete a Recipe
As a creator, I want to delete my recipe so I can manage my content.

Acceptance Criteria:

"Delete" button on dashboard

Confirmation prompt required

Removed from all views on success
Recipe Discovery
User Story 5: Search Recipes
As a viewer, I want to search by keyword so I can quickly find recipes

Acceptance Criteria:

Search input visible on browse page

Results update dynamically

"No match" message if empty

User Story 6: Guest Browsing
As a visitor, I want to browse recipes without logging in

Acceptance Criteria:

No login required to view recipes

Read-only access to recipe content

#### Auth requirement

- middleware using

```
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.payload;

    // next passes the the request object to the controller function
    // you will have req.user availiable in every single controller function
    // req.user.username
    // req.user._id
    next();
  } catch (err) {
    res.status(401).json({ err: 'Invalid token.' });
  }
}

module.exports = verifyToken;

```

this code can be updated to catch edge cases, or give a better error message for my students consuming this api.

for the controller functions you could have this functions,

```
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;

// uuid, helps generate our unique ids
// initialize the S3 consturctor function to give us the object that can perform crud operations to aws

module.exports = {
  signup,
  login,
};

async function signup(req, res) {
  console.log(req.body, " this is req.body");

  const user = new User(req.body); // data.Location is the url for your image on aws
  try {
    await user.save(); // user model .pre('save') function is running which hashes the password
    const token = createJWT(user);
    res.json({ token }); // set('toJSON',) in user model is being called, and deleting the users password from the token
  } catch (err) {
    console.log(err.message, " err.message");
    // Probably a duplicate email
    res.status(400).json(err);
  }
}

async function login(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(401).json({ err: "bad credentials" });
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (isMatch) {
        const token = createJWT(user);
        res.json({ token });
      } else {
        return res.status(401).json({ err: "bad credentials" });
      }
    });
  } catch (err) {
    console.log(err.message);
    return res.status(401).json(err);
  }
}

/*----- Helper Functions -----*/

function createJWT(user) {
  return jwt.sign(
    { user }, // data payload
    SECRET,
    { expiresIn: "24h" },
  );
}
```
