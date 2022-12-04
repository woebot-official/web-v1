const config = require('../settings/config.json');
const express = require('express');
router = express.Router();
const bodyParser = require('body-parser');
const rateLimit = require("express-rate-limit");
const { JsonDatabase } = require("wio.db");
const { sendDiscordLog } = require(`../Logger/log`);
const db = new JsonDatabase({
  databasePath:"./settings/data.json"
});

const limiter = rateLimit({
    max: 500,
    windowMs: 60 * 60 * 1000,
    message: "Admin Login is blocked by the System Rate Limiter"
});
router.use(limiter);
console.log(`>  RateLimiter Loaded`);
router.get("/", async function (req, res) {
    if (!req.user || !req.session.adminlogin) {
      return res.redirect('/~/admin/login');
    }
    res.redirect("/~/admin/panel");
});

router.get("/login", async function (req, res) {
    if (req.user || req.session.adminlogin) {
      return res.redirect('/~/admin/panel');
    }
    res.render(`admin/login`, {
        botname: "Woebot",
        query: req.query
    })
});
router.get("/panel", async function (req, res) {

    if (req.user || req.session.adminlogin) {
      return res.render(`admin/panel`, {
        api: db.get("api"),
        maintance: db.get("maintance"),
        botname: "Woebot",
        name: req.session.user.name,
        query: req.query
    })
    }else res.redirect('/~/admin/login');
});
router.get("/logout", async function (req, res) {
    await req.session.destroy();
    res.redirect('/~/admin/login');
});
const urlencodedParser = bodyParser.urlencoded({ extended: false })
router.post('/login', urlencodedParser, async function (req, res) {
    const body = req.body;
    req.session.times += 1;
    if(req.session.times >= 20){
        sendDiscordLog(`${body.name} has trying to login to admin panel`);
        return res.redirect(`/`);
    }
    if(req.session.times >= 5){
        return res.send({"Error": "You are not allowed to preform this anymore"});
    }
    
    if(config.Web.pass == body.pass){  
        req.session.user = {name: body.name, adminlogin: true}
        req.session.adminlogin = true;
        sendDiscordLog(`${body.name} has loggined to admin panel`);
        return res.send({ "Success": "You loggined sucessfully" });
    }else return res.send({ "Error": "Given Username or password was incorrect" });
})
router.post('/panel', urlencodedParser, async function (req, res) {
    const body = req.body;
    var str = "";
    const maintance = db.get("maintance");
    if(body.maintance){
        if(maintance == false){
            await db.set("maintance", true);
            str += "<br>Maintance Mode enabled.";
        }
    }else{
        if(maintance == true){
            await db.set("maintance", false);
            str += "<br>Maintance Mode Disabled.";
        }
    }
    if(body.apiurl != ''){
        await db.set("api", body.apiurl);
        str += "<br>Api Url changed.";
    }
    if(!str) res.send({"Error":"Give Aguments to update"})
    else {
        sendDiscordLog(`${req.session.user.name} has updated dashboard config.\n ${str}`)
        res.send({ "Success": str });
    }
})
router.use((err, req, res, next) => {
    if (! err) {
        return next();
    }
    console.log(err, err.stack);
    res.status(500).sendFile(path.join(__dirname, '/src/500.html'));
});
console.log(`>  Everything was clear on admin dashboard`);
module.exports = router;