import express from 'express';
import mongoose from 'mongoose';
import userModel from './models/userModel.js';
import cors from 'cors';
import nodemailer from 'nodemailer';
import {google} from 'googleapis';
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";


const app = express();
const salt = bcrypt.genSaltSync(10);
const PORT = 4000;
const secret= "pikj320423098fh58aslaksjdnlkasdnasdas1h"


mongoose.connect("mongodb+srv://task1:taskone@task1.pmggaar.mongodb.net/",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());



// Nodemailer configuration
const CLIENT_ID="707879256263-sbihhdtp3vrq5bp1b7resmubpu3iqb0k.apps.googleusercontent.com"
const CLIENT_SECRET="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"
const REFRESH_TOKEN="1//04Io9Vxh0OTKICgYIARAAGAQSNwF-L9Ir2T7p_8HSD_AYcr22-0UAhw8fHUTm4gmTGd8PtgCcJ9_Jvj4E20KG1AvbC6tRcIY1r-Q"
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const ACCESS_TOKEN="ya29.a0AbVbY6M1oGGiCXKlGjfRtterPwIt1dGpSMGhQjb-0dOYpfAPFWR8L4kH60aLW1n0inaC-99Rw6aZ9P4qIt8num3-9vI17M0IrndjlbO5Rcuckrw2FNC6gScX9qnBRZbGF3SQAdjp9lIJdYrWenv8vkRqUaCiaCgYKAboSARASFQFWKvPljOqBevZvMNgnL79IS82n0A0163"

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });


async function sendEmailWithOAuth2(mailOptions) {
    try {
      const accessToken = await oAuth2Client.getAccessToken();
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: 'kerem.4555@gmail.com',
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: accessToken,
        },
      });
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }





app.post("/register", async (req, res) => {
    const { mail,username, password } = req.body;
    try {
        const userDoc = await userModel.create({
          mail,
          username,
          password:bcrypt.hashSync(password, salt),
        });
    
        // Send registration success email
        const mailOptions = {
          from: 'kerem.4555@gmail.com',
          to: mail,
          subject: 'Registration Successful',
          text: 'You have successfully registered.',
        };
    
        sendEmailWithOAuth2(mailOptions);
    
        res.json(userDoc);
      } catch (e) {
        console.log(e);
        res.status(400).json(e);
      }

});


app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    
    const userDoc = await userModel.findOne({ username });
    const passOk = bcrypt.compareSync(password, userDoc.password);

    if (passOk) {
        // logged in
        jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json({
            id: userDoc._id,
            username,
          });
        });
      } else {
        res.status(400).json("wrong credentials");
      }

  });

 

  app.post("/logout", (req, res) => {
    res.cookie("token", "").json("ok");
  });







app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`) );
