const Server = require("./classes/server.js")
let server = new Server("./server")

process.on('SIGINT', async (code) => {
    console.log('SIGTERM received...');
    await server.stop()
    process.exit()
});

async function main() {
    await server.start() // wait for server to start
    // while (true) {
        let players = await server.list()
        // server.execute("list")
        console.log(players)
    // }
}

// process.on("before")
main()