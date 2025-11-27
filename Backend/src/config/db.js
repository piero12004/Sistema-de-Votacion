import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // Opciones modernas, mongoose ya usa defaults estables
    });

    console.log("✅ MongoDB Atlas conectado");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error);
    process.exit(1); // detener servidor si falla la BD
  }
};

export default connectDB;