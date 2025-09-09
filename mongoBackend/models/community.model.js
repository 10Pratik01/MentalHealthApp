import mongoose from 'mongoose'


const communitySchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true, 
    },
    image:{
        type:String,
    }, 
    likes:{
        type:Number,
        default:0 
    }, 
    message:{
        type:String, 
        trim: true,
        validate: {
            validator: function(v) {
                // At least message or image should be present
                return v || this.image;
            },
            message: 'Either message or image must be provided'
        }
    }
    
}, {timestamps: true})


export const Community = mongoose.model("Community", communitySchema)