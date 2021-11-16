const { Rcon } = require("rcon-client-fork")
const axios = require('axios');

const client = new Rcon()

const connectOptions = { host: "mc.hral.xyz", port: 25575, password: "fishing" }

const webhookURL = "https://discord.com/api/webhooks/909645484883341363/YKgJpqdS31LYLmJNRczcGIZi8gH56KbXNWB8PPZjigH4JBPR7fjDGXvpCZ5S4MsThshy";

const player = require('./player.json')

const joinRegex = /([A-z]+) has joined the game./
const leaveRegex = /([A-z]+) has left the game./

client.connect(connectOptions).then(() => {
    console.log("connected")

    // client.on("output", console.log)
    client.send("list").then(console.log)
})
// client.on("auth", () => {
//     console.log("Authenticated")
// }).on("response", (str) => {
//     const joined = str.match(joinRegex)
//     const left = str.match(leftRegex)

//     if (joined) {
//         const username = joined[1]
//         let json = player;

//         json.embeds[0].title = username;
//         json.embeds[0].description.replace("<action>", "joined")
//         json.embeds[0].timestamp = new Date().toISOString()
//         axios.post(webhookURL, json)
//     } else if (left) {
//         const username = left[1]
//         let json = player;
        
//         json.embeds[0].title = username;
//         json.embeds[0].description.replace("<action>", "left")
//         json.embeds[0].timestamp = new Date().toISOString()
//         axios.post(webhookURL, json)
//     }
// }).on('error', function(err) {
//     console.log("Error: " + err);
// }).on('end', function() {
//     console.log("Connection closed");
// });  
