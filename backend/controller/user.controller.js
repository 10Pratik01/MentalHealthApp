import { User } from "../models/user.model";
import { asyncHandler } from "../uils/asyncHandler";


export const registeruser = asyncHandler(async (req, res) => {
    const {email, password, name} = req.body; 

    if(!email || !password || !name){
        res.status(400);
        throw new Error("Please fill all the fields");
    }
    const userExists = await User.findOne({email}); 

    if(userExists){
        res.status(400).json({message: "User already exists"});
    }

    const user = await User.create({
        name, email, password
    })

    const salt = await bcrypt.genSalt(10);
    user.password = bcrypt.hashSync(user.password, salt);

    await user.save();

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
    });
    
})