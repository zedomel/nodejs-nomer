# nodejs-nomer
nodejs-nomer is a simple NodeJS wrapper for nomer, inspired by the [pynomer](https://github.com/nleguillarme/pynomer). [Nomer](https://github.com/globalbioticinteractions/nomer) is a stand-alone java application which maps identifiers and names to taxonomic names and ontological terms.

## Installation

```
npm install nodejs-nomer
```

## Usage

As NodeJS module:

```javascript
const Nomer = require('nodejs-nomer')
const nomer = new Nomer();
console.log(nomer.version());

// Append command
const result = nomer.append("\tHomo sapiens", "gbif-web", null, 'json')
console.log(nomer.toJson(result))
```

## License

License: GPL 3.0

## Authors

nodejs-nomer is written by [@zedomel](https://github.com/zedomel)
