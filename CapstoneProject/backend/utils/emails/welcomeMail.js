// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';
// import path from 'path';

// const configPath = path.resolve("config", "uat.env");
// dotenv.config({ path: configPath });

// const welcomeEmailTemplate = (user) => `
//   <html>
//   <body>
//     <h1>Welcome to StoreFleet, ${user.name}!</h1>
//     <p>We are excited to have you on board.</p>
//     <img src="cid:logo" alt="StoreFleet Logo" />
//   </body>
//   </html>
// `;

// export const sendWelcomeEmail = async (user) => {
//   console.log(process.env.STORFLEET_SMPT_MAIL_PASSWORD);
//   console.log(process.env.STORFLEET_SMPT_MAIL);

//   const transporter = nodemailer.createTransport({
//     service: process.env.SMPT_SERVICE,
//     auth: {
//       user: process.env.STORFLEET_SMPT_MAIL,
//       pass: process.env.STORFLEET_SMPT_MAIL_PASSWORD,
//     },
//     port: 587,
//     secure: false, // TLS
//     logger: true, // Enable logging
//     debug: true,  // Enable debugging
//   });

//   try {
//     // Define email options
//     const mailOptions = {
//       from: process.env.STORFLEET_SMPT_MAIL,
//       to: user.email,
//       subject: 'Welcome to StoreFleet!',
//       html: welcomeEmailTemplate(user),
//       attachments: [{
//         filename: 'logo.png',
//         path: path.resolve("assets", "logo.png"),
//         cid: 'logo' // same cid value as in the html img src
//       }]
//     };

//     // Send email
//     transporter.sendMail(mailOptions, (err, info) => {
//       if (err) {
//         console.log(`Error: ${err.message}`);
//       } else {
//         console.log("Email sent successfully: ", info.response);
//       }
//     });
//   } catch (error) {
//     console.log('Error sending welcome email:', error);
//   }
// };
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

const configPath = path.resolve("config", "uat.env");
dotenv.config({ path: configPath });

const welcomeEmailTemplate = (user) => `
  <html>
  <body>
    <h1>Welcome to StoreFleet, ${user.name}!</h1>
    <p>We are excited to have you on board.</p>
    <img src="cid:logo" alt="StoreFleet Logo" />
  </body>
  </html>
`;

export const sendWelcomeEmail = async (user) => {
  console.log(process.env.STORFLEET_SMPT_MAIL_PASSWORD);
  console.log(process.env.STORFLEET_SMPT_MAIL);

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
      user: 'cnanjali9@gmail.com',
      pass: 'tgac bqlh wkdk oabx',
    },
    port: 587,
    secure: false, // TLS
    logger: true, // Enable logging
    debug: true,  // Enable debugging
  });

  try {
    // Define email options
    const mailOptions = {
      from: 'cnanjali9@gmail.com',
      to: user.email,
      subject: 'Welcome to StoreFleet!',
      html: welcomeEmailTemplate(user),
      attachments: [{
        filename: 'logo.png',
        path: path.resolve("assets", "logo.png"),
        cid: 'logo' // same cid value as in the html img src
      }]
    };

    // Send email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(`Error: ${err.message}`);
      } else {
        console.log("Email sent successfully: ", info.response);
      }
    });
  } catch (error) {
    console.log('Error sending welcome email:', error);
  }
};
