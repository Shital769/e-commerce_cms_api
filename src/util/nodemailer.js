// Use at least Nodemailer v4.1.0
import nodemailer from "nodemailer";

//configure and send email

const sendEmail = async (emailBody) => {
  try {
    //config
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP,
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    //send email

    const info = await transporter.sendMail(emailBody);
    console.log("Message Sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.log(error);
  }
};

//make email template and data ready
export const newAccountEmailVerificationEmail = (link, obj) => {
  const emailBody = {
    from: `"Coding Shital", <${obj.email}>`,
    to: process.env.EMAIL_USER,
    subject: "Verify Your Email",
    text: "Please follow the link to verify your account" + link,
    html: `
        <p>Hello ${obj.fName} </p>
        <br>
        <p>
        Please follow the link to verify your account
        </p>
        <br>
        <p>
        Hi <a href = ${link}>${link}</a>
        </p>
        <br>
        <p>
        Regards,
        <br>
        Coding Shital Support Team</p>
        `,
  };
  sendEmail(emailBody);
};

//email verification notification
export const emailVerifiedNotification = ({ fName, email }) => {
  const emailBody = {
    from: `"Coding Shital", <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Account Verified",
    text: "Your account has been verrified. You may login now",
    html: `
        <p>Hello ${fName} </p>
        <br>
        <p>
        Your account has been verified. You may login now
        </p>
        <br>
        <p>
        Hi <a href = "${process.env.FRONTEND_ROOT_URL}" style = "background:green; color: white; padding:1rem 2.5px">Login</a>
        </p>
        <br>
        <p>
        Regards,
        <br>
        Coding Shital Support Team</p>
        `,
  };
  sendEmail(emailBody);
};

//email OTP
export const emailOtp = ({ token, email }) => {
  const emailBody = {
    from: `"Coding Shop", <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "OTP for password reset",
    text: "Use the following otp to reset your password " + token,
    html: `
        <p>
            Hi there,
        </p>
        <br />
        
        <p>
        Here is your opt to reset your password
        </p>
        <br >
<p>
               ${token}
    </p>
    <br >
    <p>
    Regards, 
    <br>
   Coding Shop customer care team
</p>
        `,
  };

  sendEmail(emailBody);
};

//email for update password
export const passwordUpdateNotification = (fName, email) => {
  const emailBody = {
    from: `"Coding Shital", <${obj.email}>`,
    to: process.env.EMAIL_USER,
    subject: "Your password has been updated",
    text: "Just to notify that you password has been just updated, if this wasn't you, conact us asap or change your password. ",
    html: `
        <p>Hello ${fName} </p>
        <br>
        <p>
        Just to notify that you password has been just updated, if this wasn't you, conact us asap or change your password. 
        </p>
        <br>
        <p>
        Regards,
        <br>
        Coding Shital Support Team</p>
        `,
  };
  sendEmail(emailBody);
};
