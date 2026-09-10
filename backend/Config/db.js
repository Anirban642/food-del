import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://anirban64237:KmCZo0jBQUvJzOPW@cluster0.zdhdr.mongodb.net/food-del').then(()=>console.log("DB Connected")
    );
}

// mongodb+srv://anirban64237:@cluster0.zdhdr.mongodb.net/?appName=Cluster0