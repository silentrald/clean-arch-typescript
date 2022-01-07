import mailer, { SendMailOptions } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

require('dotenv').config();

const EMAIL = process.env.EMAILER_EMAIL || 'random_email';

const transporter = mailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: EMAIL,
    pass: process.env.EMAILER_PASS,
  },
});

const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html: string,
  attachments?: Mail.Attachment[] | undefined
): Promise<void> => {
  const mail: SendMailOptions = {
    from: EMAIL,
    to, subject, text,
    html
  };

  if (attachments) mail.attachments = attachments;
    
  await transporter.sendMail(mail);
};

export default sendEmail;