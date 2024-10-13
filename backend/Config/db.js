import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://anirban64237:babai2003@cluster0.zdhdr.mongodb.net/food-del').then(()=>console.log("DB Connected")
    );
}