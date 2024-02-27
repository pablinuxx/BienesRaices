import { check, validationResult } from "express-validator";
import Usuario from "../models/Usuario.js";
import { generarId } from "../helpers/tokens.js";
import { emailRegistro } from "../helpers/emails.js";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar Sesion",
  });
};
const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    pagina: "Crear Cuenta",
    // csrfToken: req.csrfToken(),
  });
};
const registrar = async (req, res) => {
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
      //csrfToken: req.csrfToken(),
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
  //Almacenar un usuario
  const usuario = await Usuario.create({
    nombre: req.body.nombre,
    email: req.body.email,
    password: req.body.password,
    token: generarId(),
  });

  //Envia mail de confirmacion
  emailRegistro({
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token,
  });
  //Mensaje de confirmacion de Cuenta

  res.render("templates/mensaje", {
    pagina: "Cuenta Creada Correctamente",
    mensaje: "Hemos Enviado un mail de Confirmacion, presiona en el enlace ",
  });
};

// Funcion que comprueba una cuenta
const confirmar = async (req, res) => {
  const { token } = req.params;
  console.log(token);

  //Verificar si el token es valido
  const usuario = await Usuario.findOne({ where: { token } });

  if (!usuario) {
    return res.render("auth/confirmar-cuenta", {
      pagina: "Error al confirmar cuenta",
      mensaje: "Hubo un error al confirmar tu cuenta, intenta de nuevo",
      error: true,
    });
  }
  //Confirmar la cuenta
  usuario.token = null;
  usuario.confirmado = true;
  await usuario.save();
  res.render("auth/confirmar-cuenta", {
    pagina: "Cuenta Confirmada",
    mensaje: "La cuenta se confirmo correctamente",
  });
};
const formularioOlvidePassword = (req, res) => {
  res.render("auth/olvide-password", {
    pagina: "Recupera Tu Acceso a Bienes Raices",
  });
};

const resetPassword = async (req, res) => {
  await check("email")
    .notEmpty()
    .withMessage("Eso no parece un email")
    .run(req);
  let resulado = validationResult(req);

  if (!resulado.isEmpty()) {
    return res.render("auth/olvide-password", {
      pagina: "Recuperar tu acceso a BienesRaices",
      errores: resulado.array(),
    });
  }
};

export {
  formularioLogin,
  formularioRegistro,
  formularioOlvidePassword,
  registrar,
  confirmar,
  resetPassword,
};
