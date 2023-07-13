const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const User = require("./models/User");
const Message = require("./models/Message");
const ws = require("ws");
const fs = require("fs");

mongoose.set("strictQuery", true); //https://youtu.be/0AzOn34t4iE
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("connected to db!"))
  .catch((err) => {
    if (err) throw err;
  }); // https://stackoverflow.com/questions/75603536/throw-new-mongooseerrorquery-prototype-exec-no-longer-accepts-a-callback      https://mongoosejs.com/docs/migrating_to_6.html#no-more-deprecation-warning-options    https://mongoosejs.com/docs/migrating_to_7.html
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

const app = express();
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(express.json()); // For parsing application/json

app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

async function getUserDataFromRequest(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.token;
    if (token) {
      jwt.verify(token, jwtSecret, {}, (err, userData) => {
        if (err) throw err;
        //const {id,username} = userData
        resolve(userData);
      });
    } else {
      reject("no token");
    }
  });
}

app.get("/api/messages/:userId", async (req, res) => {
  /*when i do get req from this (http://localhost:4000/messages/64426f6b2db4f3f0f96b35a4) url , server will crash by saying blow error. 
  node:internal/process/promises:288
triggerUncaughtException(err, true /* fromPromise 
[UnhandledPromiseRejection: This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). The promise rejected with the reason "no token".] {
code: 'ERR_UNHANDLED_REJECTION'
}*/
  const { userId } = req.params;
  const userData = await getUserDataFromRequest(req);
  const ourUserId = userData.userId;
  const messages = await Message.find({
    sender: { $in: [userId, ourUserId] },
    recipient: { $in: [userId, ourUserId] },
  }).sort({ createdAt: 1 });
  res.json(messages);
});

app.get("/api/people", async (req, res) => {
  const users = await User.find({}, { _id: 1, username: 1 });
  res.json(users);
});

app.get("/api/profile", (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) throw err;
      console.log("userData=" + userData);
      res.json(userData);
    });
  } else {
    res.status(401).json("no token");
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findOne({ username });
  if (foundUser) {
    const passOk = bcrypt.compareSync(password, foundUser.password);
    if (passOk) {
      jwt.sign(
        { userId: foundUser._id, username },
        jwtSecret,
        {},
        (err, token) => {
          res.cookie("token", token, { sameSite: "none", secure: true }).json({
            id: foundUser._id,
          });
        }
      );
    }
  }
});

app.post("/api/logout", (req, res) => {
  res.cookie("token", "", { sameSite: "none", secure: true }).json("ok");
});

app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    const createdUser = await User.create({
      username,
      password: hashedPassword,
    });
    jwt.sign(
      { userId: createdUser._id, username },
      jwtSecret,
      {},
      (err, token) => {
        if (err) throw err;
        res
          .cookie("token", token, { sameSite: "none", secure: true }) // { sameSite: "none", secure: true } ye na likhy toh request header me cookie nhi ati becuase localhost 127.0.0.1 dono alg link h
          .status(201)
          .json({
            id: createdUser._id,
          });
      }
    );
  } catch (err) {
    if (err) throw err; // error any pr server crash ho jhe ga ye resposnse jhe ga hi nhi
    res.status(500).json("error");
  }
});

const server = app.listen(process.env.PORT, () => {
  console.log("running server at", process.env.PORT);
});

//----------------- creating web socket server in this same file ------------------------

const webSocketServer = new ws.WebSocketServer({ server });

webSocketServer.on("connection", (connection, req) => {
  function notifyAboutOnlinePeople() {
    [...webSocketServer.clients].forEach((client) => {
      client.send(
        JSON.stringify({
          online: [...webSocketServer.clients].map((c) => ({
            userId: c.userId,
            username: c.username,
          })),
        })
      );
    });
  }

  connection.isAlive = true;

  connection.timer = setInterval(() => {
    connection.ping();
    connection.deathTimer = setTimeout(() => {
      connection.isAlive = false;
      clearInterval;
      connection.terminate(connection.timer);
      notifyAboutOnlinePeople();
      console.log("dead");
    }, 1000);
  }, 5000);

  connection.on("pong", () => {
    clearTimeout(connection.deathTimer);
  });

  //  read usename and id from the cookie for this connection
  const cookies = req.headers.cookie; //console.log(req.headers);
  if (cookies) {
    const tokenCookieString = cookies
      .split(";")
      .find((str) => str.startsWith("token="));
    if (tokenCookieString) {
      const token = tokenCookieString.split("=")[1];
      if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
          if (err) throw err;
          const { userId, username } = userData;
          connection.userId = userId;
          connection.username = username;
        });
      }
    }
  }

  connection.on("message", async (message) => {
    const messageData = JSON.parse(message.toString());
    const { recipient, text, file } = messageData;
    let filename = null;
    if (file) {
      const parts = file.name.split(".");
      const ext = parts[parts.length - 1];
      filename = Date.now() + "." + ext;
      const path = __dirname + "/uploads/" + filename;
      const bufferData = new Buffer(file.data.split(",")[1], "base64");
      fs.writeFile(path, bufferData, () => {
        console.log(
          "file having size" + file.data.length + " saved at " + path
        );
      });
    }
    if (recipient && (text || file)) {
      const messageDoc = await Message.create({
        sender: connection.userId,
        recipient,
        text,
        file: file ? filename : null,
      });
      [...webSocketServer.clients]
        .filter((c) => c.userId === recipient)
        .forEach((c) =>
          c.send(
            JSON.stringify({
              text,
              sender: connection.userId,
              recipient,
              file: file ? filename : null,
              _id: messageDoc._id,
            })
          )
        );
    }
  });

  //-------------Notify everyone about online people (when someone connect)
  notifyAboutOnlinePeople();

  //console.log([...webSocketServer.clients].map(c=>c.username)); //webSocketServer.clients object hai isy array me convert krny k liye hum ny aisa kiya
});
