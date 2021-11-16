const Server = require("./classes/server.js")
const Minehook = require('./classes/minehook.js');

let server = new Server("./server")

process.on('SIGINT', async (code) => {
    console.log('SIGTERM received...');
    exit()
});

async function exit() {
    await server.stop()
    process.exit()
}

async function main() {
    try {
        await server.start() // wait for server to start
    } catch (error) {
        console.log(`error recieved ${error}`)
        exit()
    }
}

let webhook = new Minehook(/* Webhook Url */)
webhook.sendPlayerAction("hrlou", "joined")

main()