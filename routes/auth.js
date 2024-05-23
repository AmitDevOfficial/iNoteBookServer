const express = require("express");
const router = express.Router()
const User = require("../models/User")
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "AmitGoodB$oy";

// ROUTE 1: Create a user using POST "api/auth/createuser". No Login Required
router.post("/createuser", [
    body('name', 'Enter a Vaild Name').isLength({ min: 3 }),
    body('email', 'Enter a Vaild Email').isEmail(),
    body('password', 'Password must be 5 Characters').isLength({ min: 5 }),
], async (req, res) => {
    //if there are errors, return bad request and the errors--
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        //Check wheather the user with this email exits already--
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ error: "Sorry User is already exit for this email" })
        }
        //Create a new User--
        //Adding npm - ( bcrypt ) to add salt and hash to secure our password--
        const salt = await bcrypt.genSaltSync(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })

        const data = {
            user: {
                id: user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        // console.log(jwtData);
        // res.status(201).json(user)
        res.json({ success, authtoken })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})




// ROUTE 2: Create a user using POST "api/auth/login". No Login Required
router.post("/login", [
    body('email', 'Enter a Vaild Email').isEmail(),
    body('password', 'Password not be blank').exists(),
], async (req, res) => {
    let success = false;
    //if there are errors, return bad request and the errors--
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        //if Email is not match then they show this error--
        let user = await User.findOne({ email });
        if (!user) {
            success = false
            return res.status(400).json({success, error: "Please try again with the correct creditionals" });
        }
        //if Password is not match then they show this error--
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            success = false
            return res.status(400).json({ success, error: "Please try again with the correct creditionals" });
        }

        //if Email and Password is match then they give me the Auth Token--
        const data = {
            user: {
                id: user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken })

    //If My Code is the Problamtic they they show me this error--
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});



// ROUTE 3: Get logged in user details using POST "api/auth/getuser". Login Required
router.post("/getuser", fetchuser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});
module.exports = router