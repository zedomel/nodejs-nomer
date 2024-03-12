const { execSync } = require('child_process')

const getNomerValidateCmd = (filepath = "", cmd = "validate-term", properties = null) => {
    if (filepath === "") {
        throw new Exception("Filepath cannot be empty string");
    }
    let nomerCmd = `curl -L ${filepath} | nomer ${cmd}`;
    if (properties) {
        nomerCmd = `${nomerCmd} -p ${properties}`;
    }

    return nomerCmd;
}

const getNomerMatchCmd = (query = "", cmd = "append", matcher = "globi-taxon-cache", properties = null, outputFormat = null, echoOpt = "-e") => {
    let nomerCmd = `echo ${echoOpt} '${query}' | nomer ${cmd} ${matcher}`;
    if (properties) {
        nomerCmd = `${nomerCmd} -p ${properties}`;
    }
    if (outputFormat) {
        nomerCmd = `${nomerCmd} -o ${outputFormat}`;
    }

    return nomerCmd;
}

const getNomerSimpleCmd = (cmd = "version", verbose = false, properties = null, outputFormat = null) => {
    let nomerCmd = `nomer ${cmd}`;
    if (properties) {
        nomerCmd = `${nomerCmd} -p ${properties}`;
    }
    if (outputFormat) {
        nomerCmd = `${nomerCmd} -o ${outputFormat}`;
    }
    if (verbose) {
        nomerCmd = `${nomerCmd} -v`;
    }

    return nomerCmd;
}

const runNomer = (nomerCmd) => {
    try {
        const result = execSync(nomerCmd).toString();
        if (result) {
            return result.trim();
        }
    } catch (error) {
        console.log("Error running nomer cmd: " + error.message);
        return null;
    }
}

module.exports = {
    getNomerValidateCmd,
    getNomerMatchCmd,
    getNomerSimpleCmd,
    runNomer
};