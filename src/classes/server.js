const exec = require("../utils/exec")
const fs = require("fs")
const EventEmitter = require('events');
const { stderr } = require("process");

const doneRegex = /Done \([0-9]+.[0-9]+s\)! For help, type "help"/
const listRegex = /There are ([0-9]+) of a max of ([0-9]+) players online: ?([A-z0-9,_ ]+)/
const joinLeaveRegex = /([A-z0-9_]+) ([A-z]+) the game/

class Server {
    /**
     * @event "event" (event) -> server started event
     * @event "complete" (event) -> server completed event
     * @event "action" (player, action) -> player has done action
     * @event "crash" () -> server has crashed
     */
    constructor (directory, java, jvm) {
        this.directory = directory;

        this.jarFile = "server.jar"
        this.jvmArgs = [ "-Xmx1024M", "-Xms512M" ]
        this.javaExe = "java"
        if (jvm !== undefined) this.jvmArgs = jvm.split(" ")
        if (java !== undefined) this.javaExe = java
        
        this.event = new EventEmitter()
        // console event listeners
        this.event.on("event", (event) => this.log(`${event}`))
        this.event.on("complete", (event) => this.log(`${event} complete`))
        this.event.on("action", (player, action) => this.log(`${player} has ${action}`))
        this.event.on("crash", () => this.log("Crashed!"))
    }
    
    log(str) { stderr.write(`[Server] ${str}\n`) }

    #parseLine(line) {
        let matches
        if (matches = line.match(doneRegex)) { // Server Started
            this.event.emit("complete", "start")
        } else if (matches = line.match(joinLeaveRegex)) { // Player has joined/left
            this.event.emit("action", matches[1], matches[2])
        }
    }

    start() {
        this.event.emit("event", "start") // Server Starting
        return new Promise((resolve, reject) => {
            this.serverProcess = exec(this.javaExe, this.jvmArgs.concat(["-jar", this.jarFile]), this.directory);
            this.serverProcess.stdout.on("data", (data) => {
                if (data.toString().match(doneRegex)) resolve() // once server started resolves
                this.#parseLine(data.toString())
            })
            this.serverProcess.once("close", (code) => {
                if (code != 0) {
                    this.log(`Exited with code ${code}`)
                    this.event.emit("crash")
                } else {
                    this.event.emit("complete", "stop")
                }
            })
        })
    }
    
    stop() {
        return new Promise((resolve, reject) => {
            this.event.emit("event", "stop")
            this.execute("stop")
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
                }
                resolve(returnStr)
            })
        })
    }
}

module.exports = Server