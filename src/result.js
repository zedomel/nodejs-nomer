const TSV_COLUMNS = [
    'match',
    'externalId',
    'name',
    'authorship',
    'rank',
    'commonNames',
    'path',
    'pathIds',
    'pathNames',
    'pathAuthorship',
    'externalUrl'
];

class Result {

    static json(result) {
        return JSON.parse(result)
    }

    static tsv(result, toObject = false) {
        const values = result.split('\t').slice(1);
        return toObject ? Object.assign(...TSV_COLUMNS.map((k, i) => ({ [k]: values[i] }))) : values
    }
}

module.exports = Result