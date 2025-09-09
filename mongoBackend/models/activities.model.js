import mongoose from "mongoose"

const activitySchema = new mongoose.Schema({
    userId:{
        
    }
}, {timestamps: true})


export const Activity = mongoose.model('Activity', activitySchema)