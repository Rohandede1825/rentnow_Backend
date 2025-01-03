 import user from '../models/user.model.js';
 import bcrypt from 'bcryptjs';
 import { errorHandler } from '../utils/error.js';
 import jwt from 'jsonwebtoken';
 export const  signup  = async (req,res,next) => {
   const {username , email , password} = (req.body);
   const hashPsw = bcrypt.hashSync(password,10);
   const newUser = new user({username,email,password:hashPsw});
   
   try{
    await newUser.save();
    res.status(201).json("user created successfully");
   }catch(err){
       next(err);
   }
  
}
export const  login  = async (req,res,next) => {
    const {email , password} = (req.body);
    try{
        const user = await user.findOne({email});
        if(!user){
            return next(errorHandler(404,"user not found"));
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return next(errorHandler(401,"invalid credentials"));
        }
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
        res.cookie('access_token',token, { httponly:true}).status(200).json(user);

    }catch(err){
        next(err);
    }
}