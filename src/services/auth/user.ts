import nodemailer from "nodemailer";

type SendVerificationCodeT = {
  email: string;
  token: number;
};

export const sendVerificationCode = async ({
  email,
  token,
}: SendVerificationCodeT) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to: email,
    subject: "Verification Code",
    text: `Your verification code is: ${token}`, // Plain text body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
