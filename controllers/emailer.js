'use stict'

const nodemailer = require('nodemailer');
const os = require('os');

const getFecha = () => {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var day = date.getDate();
    day = (hour > 12 ? "" : "") + day - 1;
    day = (day < 10 ? "0" : "") + day;
    x = ":"
    return `${day} de ${month} del ${year} a las ${hour}hs.`
}

const controller = {
    sendMailcito: (req, res) => {
        const params = req.body;

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'formularios.latribu@gmail.com',
                pass: '123LTC$$'
            }
        });

        let fecha = getFecha();
        let senderIp = os.networkInterfaces();
        senderIp = senderIp['en0'][1];
        let nombre = params.nombre;
        let email = params.email;
        let mensaje = params.mensaje;

        var mailOptions = {
            from: `${nombre} <${email}>`,
            replyTo: `${email}`,
            to: 'leandro@latribucreativa.com',
            subject: 'Nueva consulta desde Generadores Tv',
            html: `<table width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#e4e4e4" valign="top" style="border-collapse:collapse;margin:0;padding:0"><tr><td height="20"></td></tr><tr><td width="100%" align="center" style="font-family:Arial,Helvetica,sans-serif"><table width="800" cellspacing="0" cellpadding="0" border="0" bgcolor="#FFFFFF" valign="top" style="border-collapse:collapse"><tr><td width="100%" bgcolor="#FFFFFF"><table width="100%" cellspacing="0" cellpadding="0"><tr><td height="30" colspan="3"></td></tr><tr><td width="20"></td><td><a href="https://www.generadores.tv"><img src="https://i.imgur.com/fuXnacP.png" alt="Generadores Tv" style="border:0;display:block;width:200px"></a></td><td width="20"></td></tr><tr><td height="30" colspan="3"></td></tr></table></td></tr><tr><td width="100%" bgcolor="#21849b"><table width="100%" cellspacing="0" cellpadding="0"><tr><td height="10" colspan="3"></td></tr><tr><td width="20"></td><td align="center" style="font-family:Arial,Helvetica,sans-serif;font-weight:400;font-size:16px;line-height:22px;color:#fff;text-transform:uppercase">Nueva consulta recibida.<br>${fecha}</td><td width="20"></td></tr><tr><td height="10" colspan="3"></td></tr></table></td></tr><tr><td width="100%" bgcolor="#ffffff"><table width="100%" cellspacing="0" cellpadding="0"><tr><td height="30" colspan="3"></td></tr><tr><td width="20"></td><td style="font-family:Arial,Helvetica,sans-serif;font-weight:400;font-size:16px;color:#1a1a1a"><strong>Nombre y Apellido:</strong> ${nombre}</td><td width="20"></td></tr><tr><td height="30" colspan="3"></td></tr><tr><td height="1" colspan="3" bgcolor="#cccccc"></td></tr></table></td></tr><tr><td width="100%" bgcolor="#ffffff"><table width="100%" cellspacing="0" cellpadding="0"><tr><td height="30" colspan="3"></td></tr><tr><td width="20"></td><td style="font-family:Arial,Helvetica,sans-serif;font-weight:400;font-size:16px;color:#1a1a1a"><strong>Email:</strong> <a href="mailto:${email}" target="_blank" style="text-decoration:none;color:#d60f1b">${email}</a></td><td width="20"></td></tr><tr><td height="30" colspan="3"></td></tr><tr><td height="1" colspan="3" bgcolor="#cccccc"></td></tr></table></td></tr><tr><td width="100%" bgcolor="#ffffff"><table width="100%" cellspacing="0" cellpadding="0"><tr><td height="30" colspan="3"></td></tr><tr><td width="20"></td><td style="font-family:Arial,Helvetica,sans-serif;font-weight:400;font-size:16px;color:#1a1a1a"><strong>Mensaje:</strong><br>${mensaje}</td><td width="20"></td></tr><tr><td height="50" colspan="3"></td></tr><tr><td height="1" colspan="3" bgcolor="#cccccc"></td></tr></table></td></tr><tr><td width="100%" bgcolor="#c8d6e5"><table width="100%" cellspacing="0" cellpadding="0"><tr><td height="10" colspan="3"></td></tr><tr><td width="20"></td><td align="center" style="font-family:Arial,Helvetica,sans-serif;font-weight:400;font-size:12px;color:#1a1a1a;letter-spacing:.5px;line-height:16px">Mensaje recibido el dia ${fecha}<br>||| La IP grabada es: ${senderIp}</td><td width="20"></td></tr><tr><td height="10" colspan="3"></td></tr><tr><td height="1" colspan="3" bgcolor="#cccccc"></td></tr></table></td></tr></table></td></tr><tr><td height="20"></td></tr></table>`,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return res.status(200).send({
                    status: 'error',
                    message: 'Hubo un error al enviar el email ' + error
                })
            } else {
                return res.status(200).send({
                    status: 'success',
                    message: 'Email sent: ' + info.response
                })
            }
        });
    }
}

module.exports = controller;