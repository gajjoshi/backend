const express = require('express');
const app = express();
const http = require('http').Server(app);
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');

// Direct MongoDB URI
const MONGODB_URI = 'mongodb+srv://Prime:prime@cluster0.mtl5kau.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Admin = require('./models/usermodel');
app.use(cors({
    origin: 'http://localhost:3000', // Update this to match your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies to be sent
    optionsSuccessStatus: 204
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', async (req, res) => {
    try {
        const { name, UPI, nameonupi } = req.body;

        await Admin.create({
            name,
            UPI,
            merchant: nameonupi,
        });

        res.status(200).send('User created successfully');
    } catch (error) {
        res.status(500).send('Error creating user: ' + error.message);
    }
});

app.get('/transactions', async (req, res) => {
    try {
        const transactions = await Admin.find().sort({ createdAt: -1 });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).send('Error fetching transactions: ' + error.message);
    }
});

const PORT = process.env.PORT || 5000;
http.listen(PORT, function () {
    console.log(`Backend server started on port ${PORT}`);
});
