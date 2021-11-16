const Webhook = require("../classes/webhook")
const playerActionTemplate = {
    "embeds": [{
        "title": "<player>",
        "color": 16777045,
        "description": "has <action> the game",
        "thumbnail": {
            "url": "https://cravatar.eu/helmavatar/<player>.png"
        },
    }]
}
const serverTemplate = {
    "embeds": [{
        "title": "<title>",
        "color": "<color>",
        "description": "<description>",
        "timestamp": "<timestamp>",
        "thumbnail": {
            "url": "<thumbnail>"
        },
    }]
}

class Minehook extends Webhook {
    sendPlayerAction(player, action) { this.sendFormatted(playerActionTemplate, { player: player, action: action }) }
    sendServerStart() { this.sendFormatted(serverTemplate, { title: "Started", color: 0x55FF55/* minecraft green */, description: "Server has Started", thumbnail: "https://hral.xyz/img/fishing/fish.png" }) }
    sendServerStop() { this.sendFormatted(serverTemplate, { title: "Stopped", color: 0xFF5555 /* minecraft red */, description: "Server has Stopped", thumbnail: "https://hral.xyz/img/fishing/fish.png" }) }
    sendServerCrash() { 
        let template = serverTemplate
        serverTemplate["embeds"][0]["image"] = { "url": "https://hral.xyz/img/fishing/car-crash.gif" }
        this.sendFormatted(serverTemplate, { title: "Crashed", color: 0xAA0000 /* minecraft dark red */, description: "Server has Crashed\\nRestarting in 5 seconds...", thumbnail: "https://hral.xyz/img/fishing/fish.png" }) 
    }
}

module.exports = Minehook