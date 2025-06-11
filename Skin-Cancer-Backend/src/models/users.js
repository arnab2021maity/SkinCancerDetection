import mongoose from "mongoose";


const users = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
        select: false
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
    },

});

export default mongoose.model("users", users);
