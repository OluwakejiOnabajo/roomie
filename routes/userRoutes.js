const express = require('express');
const router = express.Router();
const { signup, login, verifyToken, getUser, refreshToken, logout} = require("../controllers/userController");

router.get('/', (req, res, next) => {
    res.send("Hello World")
});

router.post('/signup', signup);
router.post('/login', login);
router.get('/user', verifyToken, getUser);
// router.get('/refresh', refreshToken, verifyToken, getUser);
// router.get('/logout', verifyToken, logout);


module.exports = router