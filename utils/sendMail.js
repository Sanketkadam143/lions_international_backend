import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { goaResetPassMail, bangaloreResetPassMail } from "./mailTemplate.js";
dotenv.config();

const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
const PASSWORD = process.env.PASSWORD;
const EMAIL_HOST = process.env.EMAIL_HOST;
const DOMAIN_URL = process.env.DOMAIN_URL;

export default async function sendMail(userName, email, resetLink) {
  let resetPasswordMail = {};
  if (DOMAIN_URL.includes("lions317f.org")) {
    resetPasswordMail = bangaloreResetPassMail(EMAIL_USERNAME,email,resetLink,userName);
  } else if (DOMAIN_URL.includes("lions317b.org")) {
    resetPasswordMail = goaResetPassMail(EMAIL_USERNAME,email,resetLink,userName);
  }
  try {
    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: 465,
      secure: true, // Set to true if using port 465 (SSL required)
      auth: {
        user: EMAIL_USERNAME,
        pass: PASSWORD,
      },

      tls: {
        rejectUnauthorized: false, // Temporarily allow unverified SSL/TLS certificates
      },
    });

    transporter.sendMail(resetPasswordMail, function (error, info) {
      if (error) {
        console.log(error);
      }
    });
  } catch (error) {
    console.log(error);
  }
}
