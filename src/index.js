import { runNomer, getNomerSimpleCmd, getNomerValidateCmd, getNomerMatchCmd } from "./utils";
import Result from './result'
import { getProperties } from "properties-file";


class Nomer {

    propertiesPath = null;
    echoOpt = "";

    constructor(propertiesPath = null, echoOpt = "") {
        this.propertiesPath = propertiesPath;
        this.echoOpt = echoOpt;
    }

    /**
     * Show version
     * @returns string
     */
    version() {
        const res = runNomer(getNomerSimpleCmd())
        return res;
    }

    clean() {
        const res = runNomer(getNomerSimpleCmd("clean", false, this.getPropertiesPath()))
        return res;
    }

    inputSchema() {
        const res = runNomer(getNomerSimpleCmd("input-schema", false, this.getPropertiesPath()))
        return res;
    }

    outputSchema() {
        const res = runNomer(getNomerSimpleCmd("output-schema", false, this.getPropertiesPath()))
        return res;
    }

    properties() {
        const res = runNomer(getNomerSimpleCmd("properties", false, this.getPropertiesPath()))
        return res;
    }

    matcher(outputFormat = "tsv", verbose = false) {
        const res = runNomer(getNomerSimpleCmd("matchers", verbose, null, outputFormat))
        return res;
    }

    validateTerm(filepath = "") {
        const res = runNomer(getNomerValidateCmd(filepath, "validate-term-link", this.getPropertiesPath()))
        return res;
    }

    replace(query = "", matcher = "globi-taxon-cache") {
        const res = runNomer(
            getNomerMatchCmd(
                query,
                "replace",
                matcher,
                this.getPropertiesPath(),
                null,
                this.echoOpt
            )
        );
        return res;
    }

    append(query = "", matcher = "globi-taxon-cache", outputFormat = "tsv") {
        const res = runNomer(
            getNomerMatchCmd(
                query,
                "append",
                matcher,
                this.getPropertiesPath(),
                outputFormat,
                this.echoOpt
            )
        );
        return res;
    }

    getPropertiesPath() {
        return this.propertiesPath;
    }

    toJson(result) {
        return Result.json(result);
    }

    toArray(result) {
        return Result.tsv(result);
    }

    toObject(result) {
        const content = this.properties(this.getPropertiesPath())
        const properties = getProperties(content)
        const schemaInput = JSON.parse(properties["nomer.schema.input"]).map((i) => i.type + 'Input')
        const schemaAppend = JSON.parse(properties["nomer.append.schema.output"]).map((i) => i.type)
        return Result.tsv(result, [...schemaInput, "matchType", ...schemaAppend])
    }


}

module.exports = Nomer;