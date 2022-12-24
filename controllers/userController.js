const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signup = async (req, res, next) => {
    const { firstname, lastname, email, phone, username, state, lga, password } = req.body;

    // Authenticate
    let existingUser;
    try {
        // existingUser = await User.findOne({ email: email });
        existingUser = await User.findOne({ "$or": [ { email: email }, { username: username}, { phone: phone} ] });
    } catch (err) {
        console.log(err);
    }
    if(existingUser) {
        return res.status(400).json({message: "User already exist. Login instead!"});
    }
    const hashedPassword = bcrypt.hashSync(password);

    const user= new User({
        firstname,
        lastname,
        email,
        phone,
        username,
        state,
        lga,
        password: hashedPassword,
    });
    
    try {
        await user.save();
    } catch(err){
        console.log(err);
    }

    return res.status(201).json({message:user})
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
    try {
        // existingUser = await User.findOne({ email: email });
        existingUser = await User.findOne({ "$or": [ { email: email }, { username: email} ] });
    } catch (err) {
        return new Error(err);
    }
    if(!existingUser) {
        return res.status(400).json({message: "User not found. Signup please"})
    }
    const ispasswordCorrect = bcrypt.compareSync(password, existingUser.password);
    if (!ispasswordCorrect){
        return res.status(400).json({message: "Invalid email / password"});
    }
    const token = jwt.sign({id: existingUser._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "35s",
    });

    res.cookie(String(existingUser._id), token, {
        path: '/',
        expires: new Date(Date.now() + 1000 * 30), //30 seconds
        httpOnly: true,
        sameSite: 'lax'
    });

    return res.status(200).json({message:"Succefully logged in", user: existingUser, token });
}

const verifyToken = (req, res, next) => {
    const cookies = req.headers.cookie;
    const token = cookies.split("=")[1];
    if(!token){
        res.status(404).json({message: "No token found"});
    }
    jwt.verify(String(token), process.env.JWT_SECRET_KEY, (err, user) => {
        if(err){
            return res.status(400).json({message:"Invalid Token"});
        }
        console.log(user.id);
        req.id = user.id;
    });
    next();
};

const getUser = async (req, res, next) => {
    const userId = req.id;
    let user;
    try {
        user = await User.findById(userId, "-password");
    } catch (err) {
        return new Error(err);
    }
    if(!user){
        return res.status(404).json({message: "User not found"})
    }

    return res.status(200).json({ user });
};

// const refreshToken = async (req, res, next) => {
//  const cookies = req.headers.cookie;
//  const prevToken = cookies.split("=")[1];
//  if(!prevToken){
//     return res.status(400).json({message: "Couldn't find token"});
//  }
//  jwt.verify(String(prevToken), JWT_SECRET_KEY, (err, user) => {
//     if(err){
//         console.log(err);
//         return res.status(403).json({message: "Authentication failed"});
//     }
//     res.clearCookies(`${user.id}`);
//     req.cookies[`${user.id}`] = "";

//     const token = jwt.sign({id: user.id}, JWT_SECRET_KEY, {
//         expiresIn: "35s",
//     });

//     res.cookie(String(user.id), token, {
//         path: "/",
//         expires: new Date(Date.now() + 1000 * 30), // 30 seconds
//         httpOnly: true,
//         sameSite: "lax",
//     });

//     req.id = user.id;
//     next();

//  })
// }

// const logout = async (req, res, next) => {

// }

module.exports = {signup, login, verifyToken, getUser};