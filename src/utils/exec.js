const { spawn } = require("child_process");

function exec(command, args) {
    const childProcess = spawn(command, args, { stdio: "pipe" });

    childProcess.on("error", function (error) {
        console.log(error);
    });

    childProcess.on("close", function (code) {
        if (code > 0) {
            console.log("Command failed with code " + code);
        }
    });
    return childProcess.stdout;
}

module.exports = exec;
