const exec = require("../utils/exec")
const doneRegex = /Done \([0-9]+.[0-9]+s\)! For help, type "help"/
const listRegex = /There are ([0-9]+) of a max of ([0-9]+) players online: ?([A-z0-9,_ ]+)/
const playerRegex = /([A-z0-9_]+) ([A-z]+) the game/
class Server {
    constructor (directory) {
        this.isRunning = false;
        this.directory = directory;
    }
    
    #parseLine(line) {
        let matches
        if (matches = line.match(doneRegex)) {
            console.log("[Server] Server started")
            this.isRunning = true;
        } else if (matches = line.match(playerRegex)) {
            console.log(matches)
        } else {
            // process.stdout.write(line)
        }
    }

    start() {
        console.log("[Server] Starting...")
        return new Promise((resolve, reject) => {
            this.serverProcess = exec("java.exe", ["-Xmx1024M", "-Xms512M", "-jar", "server.jar"], this.directory);
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
        return new Promise((resolve, reject) => {
            this.execute("list").then(str => {
                let matches = str.match(listRegex)
                // broken when there are players for some reason
                resolve( {playerCount: parseInt(matches[1]), playerMax: parseInt(matches[2]), playerList: matches[3].split(", ")} )
            })
        })
    }

    execute(command) {
        return new Promise((resolve, reject) => {
            this.serverProcess.stdin.write(command + "\n")
            this.serverProcess.stdout.once("data", (data) => {
                let returnStr = data.toString()
                if (returnStr.includes("Unknown or incomplete command")) {
                    // there was an error executing the given command
                    // throw new Error("Error executing command") //
                }
                resolve(returnStr)
            })
        })
    }
}

module.exports = Server