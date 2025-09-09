import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import connectDB from './config/connectdb.js';
import dotenv from 'dotenv';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); 
app.use(cookieParser()); 



connectDB(); // Connect to MongoDB

app.use('/', (req, res) => {
    res.send('Server is up and running');
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
