const JavaCaller = require('java-caller');
const path = require("path");

class Nomer {

    constructor() {

    }

    runNomer() {
        try {
            const java = new JavaCaller({
                jar: path.join(__dirname, "bin", "nomer.jar")
            })
            const {status, stdout, stderr}  = java.run(["-Xms256m", "-Xmx2048m"])
        } catch (error) {
            
        }
    }
}

module.exports = Nomer;