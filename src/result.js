class Result {

    static json(result) {
        const arr = [];
        result.split("\n").forEach((e) => arr.push(JSON.parse(e)))
        return arr;
    }

    static tsv(result, columns = null) {
        const arr = [];
        result.split('\n').forEach((line) => {
            arr.push(line.split('\t'));
        });

        return columns ? arr.map((v) => Object.assign(...columns.map((k, i) => ({ [k]: v[i] })))) : arr
    }
}

module.exports = Result