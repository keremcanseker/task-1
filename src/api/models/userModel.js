import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    mail: {type: String, required: true, unique: true,min:4},
    username: {type: String, required: true, unique: true,min:4},
    password: {type: String, required: true},
  
} );

const userModel = mongoose.model("User", userSchema);

export default userModel;