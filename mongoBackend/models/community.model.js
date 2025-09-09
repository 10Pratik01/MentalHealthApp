import mongoose from 'mongoose'


const communitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true, 
    },
    
}, {timestamps: true})


export const Community = mongoose.model("Community", communitySchema)