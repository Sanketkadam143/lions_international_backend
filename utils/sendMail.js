import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
const PASSWORD = process.env.PASSWORD;
const EMAIL_HOST = process.env.EMAIL_HOST;


export default async function sendMail(userName, email, resetLink) {
  const resetPasswordMail = {
    from: EMAIL_USERNAME,

    to: email,

    subject: "Reset Password for your Lions317f Account",

    html: `<div style="height:100%;margin:0;font-family:'Work Sans',Helvetica,Arial,sans-serif;background-color:#f2f4f6;color:#51545e;width:100%!important">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;margin:0;padding:0;background-color:#f2f4f6" bgcolor="#F2F4F6">
      <tbody>
        <tr>
          <td align="center" style="word-break:break-word;font-family:'Work Sans',Helvetica,Arial,sans-serif;font-size:16px">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;margin:0;padding:0">
              <tbody>
                <tr>
                  <td style="word-break:break-word;font-family:'Work Sans',Helvetica,Arial,sans-serif;font-size:12px;padding:2px 0;text-align:center" align="center">
                    <a href="https://lions317f.org/" style="font-size:16px;font-weight:bold;color:#a8aaaf;text-decoration:none" target="_blank">
                      <img src="https://lionsdistrict317f.org/api/static/assets/1690526376092-logo.png"  style="border:none" class="CToWUd">
                    </a>
                  </td>
                </tr>
  
                <tr>
                  <td width="100%" cellpadding="0" cellspacing="0" style="word-break:break-word;font-family:'Work Sans',Helvetica,Arial,sans-serif;font-size:16px;width:100%;margin:0;padding:0">
                    <table class="m_-4359619790316381139email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation" style="width:570px;margin:0 auto;padding:0;background-color:#ffffff" bgcolor="#FFFFFF">
  
                      <tbody>
                        <tr>
                          <td style="word-break:break-word;font-family:'Work Sans',Helvetica,Arial,sans-serif;font-size:16px;padding:45px">
                            <div>
                              <h1 style="margin-top:0;color:#333333;font-size:22px;font-weight:bold;text-align:left">Hii ${userName}</h1>
                              <p style="margin:.4em 0 1.1875em;font-size:16px;line-height:1.625;color:#51545e">
                                To reset your password, please follow the button below
                              </p>
                              <p style="margin:.4em 0 1.1875em;font-size:16px;line-height:1.625;color:#51545e">
                              Link is valid till 1 hour. You can generate it again if expire.
                             </p>
                              <table align="center" width="100%" cellpadding="0" cellspacing="0" style="width:100%;margin:30px auto;padding:0;text-align:center">
                                <tbody>
                                  <tr>
                                    <td align="center" style="word-break:break-word;font-family:'Work Sans',Helvetica,Arial,sans-serif;font-size:16px">
  
                                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                        <tbody>
                                          <tr>
                                            <td align="center" style="word-break:break-word;font-family:'Work Sans',Helvetica,Arial,sans-serif;font-size:16px">
                                              <table border="0" cellspacing="0" cellpadding="0">
                                                <tbody>
                                                  <tr>
                                                    <td style="word-break:break-word;font-family:'Work Sans',Helvetica,Arial,sans-serif;font-size:16px">
  
                                                      <a class="m_-7983182003019986113button" style="color:#fff;background-color:#ea3032;border-top:10px solid #ea3032;border-right:18px solid #ea3032;border-bottom:10px solid #ea3032;border-left:18px solid #ea3032;display:inline-block;text-decoration:none;border-radius:3px;box-sizing:border-box" href=${resetLink} target="_blank">RESET PASSWORD</a>
  
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <p style="margin:.4em 0 1.1875em;font-size:16px;line-height:1.625;color:#51545e">
                                If that does not work, simply copy and paste this link into your browser's address bar:
                                <a href=${resetLink} target="_blank">${resetLink}</a>
                              </p>
  
                              <p style="margin:.4em 0 1.1875em;font-size:16px;line-height:1.625;color:#51545e">
                                Thanks and Regards,<br>
                                Lions317f
                              </p>
  
                            </div>
  </div>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  <tr>
    <td style="word-break:break-word;font-family:'Work Sans',Helvetica,Arial,sans-serif;font-size:16px">
      <table class="m_-4359619790316381139email-footer" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation" style="width:570px;margin:0 auto;padding:0;text-align:center">
        <tbody>
          <tr>
            <td align="center" style="word-break:break-word;font-family:'Work Sans',Helvetica,Arial,sans-serif;font-size:16px;padding:45px">
              <p style="margin:.4em 0 1.1875em;line-height:1.625;text-align:center;font-size:13px;color:#a8aaaf">© 2023 lions317f.org All rights reserved.</p>
            </td>
          </tr>
        </tbody>
      </table>
    </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <div class="yj6qo"></div>
  <div class="adL">
  </div>
  </div>`,
  };

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
