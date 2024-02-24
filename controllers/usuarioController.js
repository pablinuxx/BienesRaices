import { check, validationResult } from "express-validator";
import Usuario from "../models/Usuario.js";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar Sesion",
  });
};
const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    pagina: "Crear Cuenta",
  });
};
const registrar = async (req, res) => {
  //Validacion

  //nombre
  await check("nombre").notEmpty().withMessage("No puede estar vacio").run(req);
  //email
  await check("email")
    .isEmail()
    .withMessage("Esto no parece un email")
    .run(req);
  //password minimo 6 caracteres
  await check("password")
    .isLength({ min: 6 })
    .withMessage("El password debe ser minimo de 6 caracteres")
    .run(req);
  //Repetir password
  await check("repetir_password")
    .equals(req.body.password)
    .withMessage("Los password no son iguales")
    .run(req);
  let resulado = validationResult(req);

  //Verificar que el resultado este vacio
  if (!resulado.isEmpty()) {
    //errores
    return res.render("auth/registro", {
      pagina: "Crear Cuenta",
      errores: resulado.array(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
    });
  }
  //Verificar que el usuario no este duplicado
  const existeUsuaruio = await Usuario.findOne({
    where: { email: req.body.email },
  });
  if (existeUsuaruio) {
    return res.render("auth/registro", {
      pagina: "Crear Cuenta",
      errores: [{ msg: "El usuario ya esta registrado" }],
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
    });
  }
  return;

  const usuario = await Usuario.create(req.body);
  res.json(usuario);
};
const formularioOlvidePassword = (req, res) => {
  res.render("auth/olvide-password", {
    pagina: "Recupera Tu Acceso a Bienes Raices",
  });
};

export {
  formularioLogin,
  formularioRegistro,
  formularioOlvidePassword,
  registrar,
};
