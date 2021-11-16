const Server = require("./classes/server.js")
let server = new Server("./server")
server.start()
setTimeout(() => {
    server.execute("say Fortnite gaming")
    server.stop()
}, 30000);