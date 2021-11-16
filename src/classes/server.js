const exec = require("../utils/exec")
const doneRegex = /Done \([0-9]+.[0-9]+s\)! For help, type "help"/

class Server {
    constructor(directory, ) {
        this.isRunning = false;
        this.directory = directory;
    }
    
    #parseLine(str) {
        if (str.match(doneRegex)) {
            console.log("[Server] Server started")
        }
    }

    start() {
        this.serverProcess = exec("java", ["-jar", "server.jar"], this.directory);
        this.serverProcess.stdout.on("data", (data) => {
            this.#parseLine(data.toString())
        })
        // process.stdin.pipe(serverProcess.stdin)
        // setTimeout(() => {
        //     serverProcess.stdin.write("say Fortnite Gaming\n")
        // }, 120000);
        // process.stdin.write("list\n");
    }
    
    stop() {
        this.execute("stop")
        this.serverProcess.on("close", (code) => {
            console.log("Server closed")
            this.isRunning = false;
            return code
        })
    }

    execute(command) {
        this.serverProcess.stdin.write(command + "\n")
    }
}

module.exports = Server