const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser"); 
const session = require('express-session')
// const bodyParser = require('body-parser');
const router = require("./routes/router");
const Redis = require("ioredis");
const RedisStore = require("connect-redis").default;
const clientRedis= new Redis();
module.exports = {
    start() {
        const app = express();

        dotenv.config();

        mongoose.connect(process.env.mongoDB);

        app.set('trust proxy', 1)
        app.use(session({
          secret: process.env.sessionKey,
          resave: false,
          saveUninitialized: true,
          store: new RedisStore({
            client: clientRedis,
          }),
          cookie: { 
            secure: false,
            httpOnly: true,
          }
        }))
        // app.use(bodyParser.urlencoded({ extended: false }));
        // app.use(bodyParser.json())
        app.use(cors());
        app.use(cookieParser());
        app.use(express.json());
        // cài đặt bảo mật cho ứng dụng
        var helmet = require('helmet');
        app.use(helmet())
        app.use(
            helmet.contentSecurityPolicy({
              directives: {
                'default-src': ["'self'"],
                'base-uri': ["'self'"],
                'block-all-mixed-content': [],
                'font-src': ["'self'", 'https:', 'data:'],
                'frame-ancestors': ["'self'"],
                'img-src': ["'self'", 'data:'],
                'object-src': ["'none'"],
                'script-src': ["'self'"],
                'script-src-attr': ["'none'"],
                'style-src': ["'self'", ' https:'],
                'upgrade-insecure-requests': [],
              },
            })
          )
        // add route
        app.use("/",router)


        app.set('view engine', 'pug');
        app.set('views', './views');
        app.use(express.static(__dirname + '/public'))


        // start listen serve
        app.listen((8000), () => {
          console.log("Server is Running ");
      })
    }
}
