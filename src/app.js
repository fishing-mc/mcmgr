
const Server = require("./classes/server.js")
const Minehook = require('./classes/minehook.js');

let server
let webhook
let options = {}

process.on('SIGINT', async (code) => {
    console.log('SIGTERM received...');
    exit()
});

async function exit() {
    await server.stop()
    process.exit()
}

async function main() {
    server = new Server(options["directory"], options["java"], options["jvm"])
    webhook = new Minehook(options["webhook"])
    server.event.on("crash", () => {
        webhook.sendServerCrash()
        console.log("Restarting in 5 seconds...")
        setTimeout(() => {
            main()
        }, 5000);
    })
    server.event.on("complete", (event) => {
        if (event === "start") webhook.sendServerStart()
        else if (event === "stop") webhook.sendServerStop()
    })
    server.event.on("action", (player, action) => webhook.sendPlayerAction(player, action))
    await server.start() // wait for server to start
    server.serverProcess.stdout.pipe(process.stdout)
    process.stdin.pipe(server.serverProcess.stdin)
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

main()