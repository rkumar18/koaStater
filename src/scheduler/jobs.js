const Queue = require('bull');
const nodemailer = require('nodemailer');

const sendMailQueue = new Queue('sendMail', {
  redis: {
    host: '127.0.0.1',
    port: 6379,
    password: 'root',
  },
});
const data = {
  email: 'rohit@yopmail.com',
};

const options = {
  delay: 60000,
  attempts: 2,
};

sendMailQueue.add(data, options);

function sendMail(email) {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: 'ad@yopmail.com',
      to: email,
      subject: 'Register Successfully',
      text: 'You have register successfully',
    };
    const mailConfig = {
      service: 'gmail',
      auth: {
        user: process.env.EMAILUSER,
        pass: process.env.EMAILPASS,
      },
    };
    // eslint-disable-next-line no-undef
    nodemailer.createTransport(mailConfig).sendMail(mailOptions, (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
}

// eslint-disable-next-line no-return-await
sendMailQueue.process(async (job) => await sendMail(job.data.email));
