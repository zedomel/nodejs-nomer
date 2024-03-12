const { exec } = require('child_process')

class Nomer {

    constructor() {

    }

    getNomerValidateCmd(filepath="", cmd="validate-term",properties=null) {
        if (filepath === "") {
            throw new Exception("Filepath cannot be empty string");
        }
        let nomerCmd = `curl -L ${filepath} | nomer ${cmd}`;
        if (properties) {
            nomerCmd = `${nomerCmd} -p ${properties}`;
        }

        return nomerCmd;
    }

    getNomerMatchCmd(query="",cmd="append",matcher="globi-taxon-cache",properties=null,outputFormat=null,echoOpt="") {
        let nomerCmd = `echo ${echoOpt} ${query} | nomer ${cmd} ${matcher} -Xmx4096m -Xms1024m`;
        if (properties) {
            nomerCmd = `${nomerCmd} -p ${properties}`;
        }
        if (outputFormat) {
            nomerCmd = `${nomerCmd} -o ${outputFormat}`;
        }

        return nomerCmd;
    }

    getNomerSimpleCmd(cmd="version", verbose=false, properties=null, outputFormat=null) {
        
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