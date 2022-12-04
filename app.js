const config = require('./settings/config.json');
require('dotenv').config();
const express = require('express');
session = require("express-session");
const path = require('path');
const app = express();
const port = process.env.PORT;
const morgan = require('morgan')
const { JsonDatabase } = require("wio.db");
const db = new JsonDatabase({
  databasePath:"./settings/data.json"
});
const log = require(`./Logger/log`);
setupDatabase();
console.log(`>  Starting The DashBoard`);
app.use(express.static(path.join(__dirname,`/src/public`)));
app.set(`views`, path.join(__dirname, `/src/views`));
app.set(`view engine`,`ejs`);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: config.Web.Secret, resave: false, saveUninitialized: false }));
console.log(`>  Loading Express & Logger`);
morgan.token("custom", "\n<Logger> A new :method request for :url was received." +"It took :total-time[2] milliseconds to be resolved.\nDate -> :date | User -> :user-agent | Status -> :status | Response Time -> :response-time s");
app.use(morgan('custom'));
console.log(`>  Logger Loaded`);
app.use(async function (req, res, next) {
  req.user = req.session?.user;
  next();
})

app.all(['*app.js*', '*src/**', '*settings/**', '*package.json*', '*css/**', '*fonts/**', '*js/**', '*scss/**'], async function (req, res, next)  {res.redirect('/?n=true')})

const adminRouter = require("./routes/admin");
const mainRouter = require("./routes/index");
app.use("/~/admin", adminRouter);
console.log(`>  Loaded admin router`);
app.use("/", mainRouter);
console.log(`>  Loading error handling`);
app.use(function(req, res) {
  res.status(404).sendFile(path.join(__dirname, '/src/404.html'));
});
app.use(async function (err, req, res, next)  {
  if (! err) {
    return next();
  }
  console.log(err, err.stack);
  res.status(500).sendFile(path.join(__dirname, '/src/500.html'));
});

console.log(`>  Initilizing AntiCrash...`);
process.on('multipleResolves', (type, promise, reason) => { 
  console.log('=== [antiCrash] | [multipleResolves] | [start] ===');
  console.log(`${type}, ${promise}, ${reason}`);
  console.log('=== [antiCrash] | [multipleResolves] | [end] ===');
});
process.on('unhandledRejection', (reason, promise) => { 
  console.log('=== [antiCrash] | [unhandledRejection] | [start] ===');
  console.log(`${promise}, ${reason.stack}`, reason);
  console.log('=== [antiCrash] | [unhandledRejection] | [end] ==='); 
});
process.on('rejectionHandled', (promise) => { 
  console.log('=== [antiCrash] | [rejectionHandled] | [start] ===');
  console.log(`${promise}`);
  console.log('=== [antiCrash] | [rejectionHandled] | [end] ===');    
})
process.on("uncaughtException", (err, origin) => {
  console.log('=== [antiCrash] | [uncaughtException] | [start] ===');
  console.log(`${err.stack}, ${origin}`);
  console.log('=== [antiCrash] | [uncaughtException] | [end] ===');
});
process.on('uncaughtExceptionMonitor', (err, origin) => { 
  console.log('=== [antiCrash] | [uncaughtExceptionMonitor] | [start] ===');
  console.log(`${err.stack}, ${origin}`);
  console.log('=== [antiCrash] | [uncaughtExceptionMonitor] | [end] ===');
});
console.log(`>  Anti Crash system Loaded`);

console.log(`>  Error handling loaded`);
app.listen(port, () => {  
  console.log(`>  DashBoard Is active on Port: ${port}`);
  log.sendDiscordLog(`DashBoard was loaded on port ${port}`);
}); 

async function setupDatabase(){
  const maini = db.get("maintance");
  if(maini == null) db.set("maintance", false);
  const api = db.get("api");
  if(api == null) db.set("api", config.Web.apiurl);
}