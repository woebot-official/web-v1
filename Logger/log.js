const fetch = require("cross-fetch");

  async function sendDiscordLog(msg){
    var params = {
    username: "Web Logger",
    content: msg
  }
  fetch('https://discord.com/api/webhooks/1040975824054140968/ifIeVmvPJ4yiIDOfWiW6LfUzRQ4EeP2kE0HwYUbJxwk5QQFDTT2RbJGVWlGppG3hfZvk', {
    method: "POST",
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(params)
  }).then(res => {
    console.log(`Webhook response =>`,res.status, res.statusText,`\nMsg => ${msg}`);
  })
}
module.exports = { sendDiscordLog };