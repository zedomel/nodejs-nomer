class Result {

    static json(result) {
        return JSON.parse(result)
    }

    static tsv(result) {
        return result.split('\t')
    }
}

module.exports = Result