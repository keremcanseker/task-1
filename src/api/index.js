import express from "express";
import mongoose from "mongoose";
import userModel from "./models/userModel.js";
import cors from "cors";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";

const app = express();
const salt = bcrypt.genSaltSync(10);

const secret = "pikj320423098fh58aslaksjdnlkasdnasdas1h";

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());

// Nodemailer configuration
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendEmailWithOAuth2(mailOptions) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "kerem.4555@gmail.com",
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
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

app.post("/register", async (req, res) => {
  const { mail, username, password } = req.body;
  try {
    const userDoc = await userModel.create({
      mail,
      username,
      password: bcrypt.hashSync(password, salt),
    });

    // Send registration success email
    const mailOptions = {
      from: "kerem.4555@gmail.com",
      to: mail,
      subject: "Registration Successful",
      text: "You have successfully registered.",
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Server running on port: http://localhost:${PORT}`)
);
