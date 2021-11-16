const Server = require("./classes/server.js")
const Minehook = require('./classes/minehook.js');

let server = new Server("./server")
let webhook = new Minehook(/* webhook url */)

process.on('SIGINT', async (code) => {
    console.log('SIGTERM received...');
    exit()
});

async function exit() {
    await server.stop()
    // process.exit()
}

async function main() {
    server.event.on("crash", () => {
        webhook.sendServerCrash()
        console.log("Restarting in 5 seconds...")
        setTimeout(() => {
            delete server
            server = new Server("./server")
            main()
        }, 5000);
    })
    server.event.on("complete", (event) => {
        console.log("completed", event)
        if (event === "start") webhook.sendServerStart()
        else if (event === "stop") webhook.sendServerStop()
    })
    server.event.on("action", (player, action) => webhook.sendPlayerAction(player, action))
    await server.start() // wait for server to start
}

main()