import { User } from "../models/user.model";
import { asyncHandler } from "../uils/asyncHandler";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const registeruser = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const salt = await bcrypt.genSalt(process.env.SALT_ROUNDS);
  user.password = bcrypt.hashSync(user.password, salt);

  await user.save();

  const token = generateToken(user.id);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res.status(201).cookie("token", token, options).json({
    _id: user._id,
    name: user.name,
    email: user.email,
  });
});


