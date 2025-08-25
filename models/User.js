import mongoose from 'mongoose';
const userSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,

    },
    email:{
        type:String,
        required:true,
        unique:true
        
    },
    password:{
        type:String,
        required:true
    },
    profileImage:{
        type:String,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    verificationCode:{
        type:String,
        index:true
    },

},{timestamps:true}
);
export default mongoose.model('User', userSchema);
