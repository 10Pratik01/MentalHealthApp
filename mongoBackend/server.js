import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import connectDB from './config/connectdb.js';
import dotenv from 'dotenv';
import {userRouter} from './routes/user.route.js'
import activityRouter from './routes/activity.route.js'
import dailyRouter from './routes/daily.route.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); 
app.use(cookieParser()); 



connectDB(); // Connect to MongoDB

app.use('/api/status', (req, res) => {
    res.send('Server is up and running');
})

app.use('/api/auth',userRouter )
app.use('/api/v1/activity', activityRouter)
app.use("/api/v1/daily", dailyRouter)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
