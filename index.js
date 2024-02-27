import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import db from "./config/db.js";
//import cookieParser from "cookie-parser";
//import csurf from "csurf";

//Creo la app
const app = express();

//app.use(cookieParser());
//const csrfProtection = csurf({ cookie: true });
//Habilitarlectura de datos en formulario
app.use(express.urlencoded({ extended: true }));

//Conexion a la BD
try {
  await db.authenticate();
  db.sync(); //crear las tablas en la BD
  console.log("Conexion correcta a la BD");
} catch (error) {
  console.log(`error: ${error}`);
}
//Habilitar Pug
app.set("view engine", "pug");
app.set("views", "./views");

//Carpeta Publica
app.use(express.static("public"));

//Routing
app.use("/auth", usuarioRoutes);

//Definir puerto y arrancar la App
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`El servidor esta corriendo en el puerto: ${port}`);
});
