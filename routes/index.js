const config = require('../settings/config.json');
const express = require('express');
router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const fetch = require("cross-fetch");
const { JsonDatabase } = require("wio.db");

const db = new JsonDatabase({
  databasePath:"./settings/data.json"
});

router.get(`/`, async function (req, res)  {
    const maini = db.get("maintance");
    if(maini != null && maini == true) return res.sendFile(path.join(__dirname, '../src/maintance.html'));
    var data;
    try{
    const response = await fetch(db.get("api")+'/api/v1/stats');
    data = await response.json();
    }catch(e){
      data = require(`../demo/stats.json`);
    }
    res.render(`index`, {
      botname: data.botname,
      stats: data,
      avatar: data.avatar,
      query: req.query
    })
  })
  
  router.get('/stats', async function (req, res) {
    const maini = db.get("maintance");
    if(maini != null && maini == true) return res.sendFile(path.join(__dirname, '../src/maintance.html'));
    var data, infos, status;
    try{
    const response = await fetch(db.get("api")+'/api/v1/stats');
    const info = await fetch(db.get("api")+'/api/v1/info');
    data = await response.json();
    infos = await info.json();
    status = true;
    }catch(e){
      data = require(`../demo/stats.json`);
      infos = require(`../demo/info.json`);
      status = false;
    }
    res.render(`stats`, {
      api: status,
      info: infos,
      botname: data.botname,
      stats: data,
      avatar: data.avatar
    })
  });
  router.get('/commands', async function (req, res)  {
    const maini = db.get("maintance");
    if(maini != null && maini == true) return res.sendFile(path.join(__dirname, '../src/maintance.html'));
    var data, cmds, slashs, status;
    try{
    const response = await fetch(db.get("api")+'/api/v1/stats');
    const cmd = await fetch(db.get("api")+'/api/v1/commands');
    const slash = await fetch(db.get("api")+'/api/v1/slashcommands');
    data = await response.json();
    cmds = await cmd.json();
    slashs = await slash.json();
    status = true;
    }catch(e){
      data = require(`../demo/stats.json`);
      cmds = require(`../demo/commands.json`);
      slashs = require(`../demo/slashcommands.json`);
      status = false;
    }
    res.render(`commands`, {
      api: status,
      botname: data.botname,
      stats: data,
      command: cmds,
      slashcommand: slashs,
      avatar: data.avatar
    })
  })
  router.get(`/terms`, async function (req, res)  {
    const maini = db.get("maintance");
    if(maini != null && maini == true) return res.sendFile(path.join(__dirname, '../src/maintance.html'));
    var data;
    try{
      const response = await fetch(db.get("api")+'/api/v1/stats');
      data = await response.json();
    }catch(e){
      data = require(`../demo/stats.json`);
    }
    res.render(`terms`, {
      botname: data.botname,
      stats: data,
      avatar: data.avatar
    })
  })
  router.get(`/privacy`, async function (req, res)  {
    const maini = db.get("maintance");
    if(maini != null && maini == true) return res.sendFile(path.join(__dirname, '../src/maintance.html'));
    var data;
    try{
      const response = await fetch(db.get("api")+'/api/v1/stats');
      data = await response.json();
    }catch(e){
      data = require(`../demo/stats.json`);
    }
    res.render(`privacy`, {
      botname: data.botname,
      stats: data,
      avatar: data.avatar
    })
  }) 
  router.get(`/docs`, async function (req, res)  {
    const maini = db.get("maintance");
    if(maini != null && maini == true) return res.sendFile(path.join(__dirname, '../src/maintance.html'));
    var data;
    try{
      const response = await fetch(db.get("api")+'/api/v1/stats');
      data = await response.json();
    }catch(e){
      data = require(`../demo/stats.json`);
    }
    res.render(`docs`, {
      botname: data.botname,
      stats: data,
      avatar: data.avatar
    })
  })

  router.get('/discord', async function (req, res)  {res.redirect(config.Bot.Support)})
  router.get('/dc', async function (req, res)  {res.redirect(config.Bot.Support)})
  router.get('/invite', async function (req, res)  {res.redirect(config.Bot.Invite)})
  router.get('/vote', async function (req, res)  {res.redirect(config.Bot.Vote)})

  module.exports = router;