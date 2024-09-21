const nodemailer = require('nodemailer')

class MailSender {
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASSWORD
      },
    })
  }

  sendMail(targetEmail, content) {
    const message = {
      from: 'OpenMusic App',
      to: targetEmail,
      subject: 'Export Playlist',
      text: 'Terlampir hasil dari export playlist',
      attachments: [{
        filename: 'playlist.json',
        content,
      }]
    }

    return this._transporter.sendMail(message)
  }
}

module.exports = MailSender
