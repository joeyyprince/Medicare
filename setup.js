const fs = require('fs');

const appCode = [
  'const express = require("express");',
  'const session = require("express-session");',
  'const MongoStore = require("connect-mongo");',
  'const helmet = require("helmet");',
  'const morgan = require("morgan");',
  'const path = require("path");',
  'require("dotenv").config();',
  'const connectDB = require("./config/db");',
  'const app = express();',
  'connectDB();',
  'app.use(helmet());',
  'app.use(morgan("dev"));',
  'app.use(express.urlencoded({ extended: false }));',
  'app.use(express.json());',
  'app.use(express.static(path.join(__dirname, "public")));',
  'app.set("view engine", "ejs");',
  'app.set("views", path.join(__dirname, "views"));',
  'app.use(session({',
  '  secret: process.env.SESSION_SECRET,',
  '  resave: false,',
  '  saveUninitialized: false,',
  '  store: new MongoStore({ mongoUrl: process.env.MONGO_URI }),',
  '  cookie: { httpOnly: true, secure: false, maxAge: 3600000 }',
  '}));',
  'app.use((req, res, next) => {',
  '  res.locals.user = req.session.user || null;',
  '  next();',
  '});',
  'app.get("/", (req, res) => {',
  '  res.send("MediCare Hospital System is running!");',
  '});',
  'app.use((req, res) => {',
  '  res.status(404).send("Page not found");',
  '});',
  'const PORT = process.env.PORT || 3000;',
  'app.listen(PORT, () => {',
  '  console.log("Server running on http://localhost:" + PORT);',
  '});'
].join('\n');

fs.writeFileSync('app.js', appCode);
console.log('app.js created successfully!');



