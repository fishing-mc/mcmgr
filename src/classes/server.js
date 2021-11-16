const exec = require("../utils/exec")
const doneRegex = /Done \([0-9]+.[0-9]+s\)! For help, type "help"/
const listRegex = /There are [0-9]+ of a max of [0-9]+ players online: ([A-z, ]+)/
class Server {
    constructor(directory, ) {
        this.isRunning = false;
        this.directory = directory;
    }
    
    #parseLine(str) {
        if (str.match(doneRegex)) {
            console.log("[Server] Server started")
            this.isRunning = true;
        } else {
            process.stdout.write(str)
        }
    }

    start() {
        console.log("[Server] Starting...")
        return new Promise((resolve, reject) => {
            this.serverProcess = exec("java.exe", ["-Xmx1024M", "-Xms512M", "-jar", "server.jar", "nogui"], this.directory);
            this.serverProcess.stdout.on("data", (data) => {
                if (data.toString().match(doneRegex)) resolve() // once server started resolves
                this.#parseLine(data.toString())
            })
        })
    }
    
    stop() {
        return new Promise((resolve, reject) => {
            if (!this.isRunning) resolve()
            this.execute("stop")
            this.serverProcess.once("close", (code) => {
                console.log("Server closed")
                this.isRunning = false;
                resolve()
            })
        })
    }

    list() {
        this.execute("list").then(str => {
            console.log(str)
            let matches = str.match(listRegex)
            return matches[1].split(", ")
        })
    }

    execute(command) {
        return new Promise((resolve, reject) => {
            this.serverProcess.stdin.write(command + "\n")
            this.serverProcess.stdout.once("data", (data) => {
                resolve(data.toString())
            })
        })
    }
}

module.exports = Server