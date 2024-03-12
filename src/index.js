import { runNomer, getNomerSimpleCmd, getNomerValidateCmd, getNomerMatchCmd } from "./utils";
import Result from './result'

class Nomer {

    constructor(properties = null, echoOpt = "") {

    }

    /**
     * Show version
     * @returns string
     */
    version() {
        const res = runNomer(getNomerSimpleCmd())
        return res;
    }

    clean(properties = null) {
        const res = runNomer(getNomerSimpleCmd("clean", this.getProperties(properties)))
        return res;
    }

    inputSchema(properties = null) {
        const res = runNomer(getNomerSimpleCmd("input-schema", this.getProperties(properties)))
        return res;
    }

    outputSchema(properties = null) {
        const res = runNomer(getNomerSimpleCmd("output-schema", this.getProperties(properties)))
        return res;
    }

    properties(properties = null) {
        const res = runNomer(getNomerSimpleCmd("properties", this.getProperties(properties)))
        return res;
    }

    matcher(outputFormat = "tsv", verbose = false) {
        const res = runNomer(getNomerSimpleCmd("matchers", verbose, null, outputFormat))
        return res;
    }

    validateTerm(filepath = "", properties = null) {
        const res = runNomer(getNomerValidateCmd(filepath, "validate-term-link", this.getProperties(properties)))
        return res;
    }

    replace(query = "", matcher = "globi-taxon-cache", properties = null, echoOpt = "") {
        const res = runNomer(
            getNomerMatchCmd(
                query,
                "replace",
                matcher,
                this.getProperties(properties),
                null,
                echoOpt
            )
        );
        return res;
    }

    append(query = "", matcher = "globi-taxon-cache", properties = null, outputFormat = "tsv", echoOpt = "") {
        const res = runNomer(
            getNomerMatchCmd(
                query,
                "append",
                matcher,
                this.getProperties(properties),
                outputFormat,
                echoOpt
            )
        );
        return res;
    }

    getProperties(p) {
        return p;
    }

    toJson(result) {
        return Result.json(result);
    }

    toArray(result) {
        return Result.tsv(result);
    }


}

module.exports = Nomer;