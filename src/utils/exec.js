const { spawn } = require("child_process");

function exec(command, args, directory) {
    const childProcess = spawn(command, args, { stdio: "pipe", cwd: directory, detached: true });

    childProcess.on("error", function (error) {
        console.log(error);
    });

    childProcess.on("close", function (code) {
        if (code > 0) {
            console.log("Command failed with code " + code);
        }
    });
    return childProcess;
}

module.exports = exec;