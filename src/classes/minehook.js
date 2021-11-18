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
    sendServerStart() { this.sendFormatted(serverTemplate, { title: "Started", color: 0x55FF55/* minecraft green */, description: "Server has started", thumbnail: "https://hral.xyz/img/fishing/fish.png" }) }
    sendServerStop() { this.sendFormatted(serverTemplate, { title: "Stopped", color: 0xFF5555 /* minecraft red */, description: "Server has stopped", thumbnail: "https://hral.xyz/img/fishing/fish.png" }) }
    sendServerCrash() { 
        let template = JSON.parse(JSON.stringify(serverTemplate));
        template["embeds"][0]["image"] = { "url": "https://hral.xyz/img/fishing/car-crash.gif" }
        this.sendFormatted(template, { title: "Crashed", color: 0xAA0000 /* minecraft dark red */, description: "Server has crashed\\nRestarting in 5 seconds...", thumbnail: "https://hral.xyz/img/fishing/fish.png" }) 
    }
    sendServerRestart() {
        let template = JSON.parse(JSON.stringify(serverTemplate));
        template["embeds"][0]["image"] = { "url": "https://tenor.com/view/viralhog-driving-idc-accident-gif-11703558" }
        this.sendFormatted(template, { title: "Restarting", color: 0x00AA00 /* minecraft dark green */, description: "Server is restarting", thumbnail: "https://hral.xyz/img/fishing/fish.png" }) 
    }
}

module.exports = Minehook