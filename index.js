import express from 'express'
import usuarioRoutes from "./routes/usuarioRoutes.js"
//Creo la app
const app = express()


//Habilitar Pug
app.set('view engine',"pug")
app.set("views","./views")

//Carpeta Publica
app.use(express.static('public'))


//Routing
app.use("/auth",usuarioRoutes)


//Definir puerto y arrancar la App
const port = 4000

app.listen(port,()=>{
    console.log(`El servidor esta corriendo en el puerto: ${port}`);
})