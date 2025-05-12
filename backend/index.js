const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const cookieParser = require('cookie-parser');

// Routes
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const postRoute = require('./routes/Posts');
const commentRoute = require('./routes/Comments');

dotenv.config();

// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database connection established");
    } catch(err) {
        console.log(err);
    }
}

// Middleware
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/images", express.static(path.join(__dirname, "/images")));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);

// Image upload
const storage = multer.diskStorage({
    destination: (req, file, fn) => {
        fn(null, "images");
    },
    filename: (req, file, fn) => {
        fn(null, req.body.img);
    }
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
    res.status(200).json("Image uploaded successfully");
});

// Start server
app.listen(process.env.PORT, () => {
    connectDB();
    console.log("App listening on port " + process.env.PORT);
});