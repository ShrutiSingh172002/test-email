let express = require("express"),
  path = require('path'),
  nodeMailer = require('nodemailer'),
  bodyParser = require('body-parser');

// Load environment variables
require('dotenv').config();

let app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.static('src'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.post('/send-email', function (req, res) {
  console.log('📧 Email request received:', {
    to: req.body.to,
    subject: req.body.subject,
    messageLength: req.body.message.length
  });

  let transporter = nodeMailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, 
      auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
      }
  });
      let mailOptions = {
        to: req.body.to || process.env.EMAIL_TO,
        subject: req.body.subject,
        html: req.body.message.replace(/\n/g, '<br>')
    };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('❌ Email error:', error);
            console.log('📧 Failed email details:', mailOptions);
            res.status(500).json({ success: false, message: 'Failed to send email' });
            return;
        }
        console.log('✅ Message sent successfully!');
        console.log('📧 Email details:', {
          messageId: info.messageId,
          to: mailOptions.to,
          subject: mailOptions.subject
        });
        res.json({ success: true, message: 'Email sent successfully!' });
    });
});

let server = app.listen(8081, function(){
    let port = server.address().port;
    console.log("Server started at http://localhost:%s", port);
});
