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

class Minehook extends Webhook {
    constructer (url) {
        this.webhook = new Webhook(url)
    }

    sendServerStart()

    sendPlayerAction(player, action) {
        let playerAction = JSON.stringify(playerActionTemplate)
        playerAction = playerAction.replace(/<action>/g, action)
        playerAction = playerAction.replace(/<player>/g, player)
        this.send(playerAction)
    }

}

module.exports = Minehook