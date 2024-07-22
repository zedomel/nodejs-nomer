const { execSync, spawn } = require('child_process')

export const getNomerValidateCmd = (filepath = "", cmd = "validate-term", properties = null) => {
    if (filepath === "") {
        throw new Exception("Filepath cannot be empty string");
    }
    let nomerCmd = `curl -L ${filepath} | nomer ${cmd}`;
    if (properties) {
        nomerCmd = `${nomerCmd} -p ${properties}`;
    }

    return nomerCmd;
}

export const getNomerMatchCmd = (query = "", cmd = "append", matcher = "globi-taxon-cache", properties = null, outputFormat = null, echoOpt = "-e") => {
    let nomerCmd = `echo ${echoOpt} '${query}' | nomer ${cmd} ${matcher}`;
    if (properties) {
        nomerCmd = `${nomerCmd} -p ${properties}`;
    }
    if (outputFormat) {
        nomerCmd = `${nomerCmd} -o ${outputFormat}`;
    }

    return nomerCmd;
}

export const getNomerSimpleCmd = (cmd = "version", verbose = false, properties = null, outputFormat = null) => {
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

export const runNomer = (nomerCmd) => {
    try {
        const result = execSync(nomerCmd, {
            maxBuffer: 4096 * 4096,
        }).toString();
        if (result) {
            return result.trimEnd();
        }
    } catch (error) {
        console.log("Error running nomer cmd: " + error.message);
        return null;
    }
}

export const runNomerAsync = (nomerCmd) => {
    const nomerCmdArr = nomerCmd.split(/\s+/)
    const p = spawn(nomerCmdArr[0], nomerCmdArr.slice(1), {
        // maxBuffer: 4096 * 4096
        shell: true
    })

    return p
}