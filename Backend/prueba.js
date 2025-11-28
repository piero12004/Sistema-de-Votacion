import 'dotenv/config';
import mongoose from "mongoose";

const uri = process.env.MONGO_URI;
console.log("MONGO_URI:", uri); // 👈 verifica que sí lo lea

mongoose.connect(uri)
  .then(() => console.log("Conectado a MongoDB"))
  .catch(err => console.log(err));

const Test = mongoose.model("Test", new mongoose.Schema({ nombre: String }));

Test.create({ nombre: "Hola Mongo" })
  .then(() => console.log("Documento creado"))
  .finally(() => mongoose.disconnect());
