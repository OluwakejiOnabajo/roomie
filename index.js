const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const router = require("./routes/userRoutes");
const cors = require('cors');
const cookieParser = require("cookie-parser");

dotenv.config();

// mongoose.set('strictQuery', true);
 
app.use(express.json());
app.use(cors({credentials: true, origin: "http://localhost:3000"}));
app.use("/api", router);
app.use(cookieParser());
// mongoose.connect("mongodb+srv://admin:75pt5oW9cNG38MA8@cluster0.sa4gwby.mongodb.net/wegovote?retryWrites=true&w=majority")
mongoose.connect(process.env.DATABASE_ACCESS)
.then(() => {
    app.listen(5000);
    console.log("Datebase is connected! Listening to localhost 5000");
})
.catch((err) => console.log(err));


//75pt5oW9cNG38MA8