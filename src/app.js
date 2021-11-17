
const Server = require("./classes/server.js")
const Minehook = require('./classes/minehook.js');

let options = {}

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

// Get options from the command line
for (var i = 0; i < process.argv.length; i++) {
    switch (process.argv[i]) {
    case "-d":
    case "--directory":
        options["directory"] = process.argv[++i]
        break
    case "-w":
    case "--webhook":
        options["webhook"] = process.argv[++i]
        break
    case "-j":
    case "--java":
        options["java"] = process.argv[++i]
        break
    case "-a":
    case "--jvm":
        options["jvm"] = process.argv[++i]
        break
    default:
        console.log("Unknown options", process.argv[i])
    }
}

let server = new Server(options["directory"], options["java"], options["jvm"])
let webhook = new Minehook(options["webhook"])

main()