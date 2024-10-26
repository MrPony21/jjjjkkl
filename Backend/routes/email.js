const express = require('express')
const router = express.Router()
const nodemailer = require("nodemailer");
router.use(express.json())
require("dotenv").config();

router.get('/', (req, res) => {
    res.send("Ruta de email funciona correctamente");
})

function emailBody(OTP) {
  if (!OTP) return `
    <p style="font-size:1.1em">Hola,</p> 
    <p>Te informamos que se ha solicitado la eliminación de tu cuenta en AYD-Storage. Si no fuiste tú quien hizo esta solicitud, por favor contáctanos.</p>`;
  return`
    <p style="font-size:1.1em">Hola,</p> 
    <p>Gracias por elegir AYD-Storage. Usa el siguiente OTP para completar tu procedimiento de verificación. El OTP es válido por 5 minutos.</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>`;
  
}

function sendEmail({ recipient_email, OTP }, subject, messageBody) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const mail_configs = {
      from: process.env.MY_EMAIL,
      to: recipient_email,
      subject: subject,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AYD - Email</title>
</head>
<body>
  <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">AYD-Storage</a>
      </div>
      ${messageBody} <!-- Dynamic message content -->
      <p style="font-size:0.9em;">Saludos,<br />AYD-Storage</p>
      <hr style="border:none;border-top:1px solid #eee" />
      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
        <p>AYD Inc</p>
        <p>Guatemala</p>
      </div>
    </div>
  </div>
</body>
</html>`,
    };

    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: `An error has occurred` });
      }
      return resolve({ message: "Email sent successfully" });
    });
  });
}


router.post("/send_recovery_email", (req, res) => {
  const otpMessage = emailBody(req.body.OTP);
  sendEmail(req.body, "RECUPERAR CUENTA - AYD", otpMessage)
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});


router.post("/send_verification_email", (req, res) => {
  const otpMessage = emailBody(req.body.OTP);
  sendEmail(req.body, "VERIFICAR CUENTA - AYD", otpMessage)
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});


router.post("/send_delete_email", (req, res) => {
  const deleteMessage = emailBody(req.body.OTP);
  sendEmail(req.body, "ELIMINAR CUENTA - AYD", deleteMessage)
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

module.exports = router