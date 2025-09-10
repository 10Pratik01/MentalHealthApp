import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import connectDB from './config/connectdb.js';
import dotenv from 'dotenv';
import {userRouter} from './routes/user.route.js'
import activityRouter from './routes/activity.route.js'
import dailyRouter from './routes/daily.route.js';
import chatRoutes from './routes/chat.route.js'
import communityRouter from './routes/community.routes.js'
import scheduleRouter from './models/schedule.model.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); 
app.use(cookieParser()); 



connectDB(); // Connect to MongoDB

app.use('/api/status', (req, res) => {
    res.send('Server is up and running');
})

app.use('/api/v1/auth',userRouter )
app.use('/api/v1/activity', activityRouter)
app.use("/api/v1/daily", dailyRouter)
app.use('/api/v1/chat', chatRoutes)
app.use('/api/v1/community', communityRouter)
app.use('/api/v1/schedule', scheduleRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
