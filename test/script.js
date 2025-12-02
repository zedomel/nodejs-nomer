const fs = require('fs');
const path = require('path');
const os = require('os');
const Nomer = require("nodejs-nomer");

const tempFilePath = path.join(os.tmpdir(), 'nomer.properties');
fs.writeFileSync(tempFilePath, `nomer.schema.input=[{"column":0,"type":"externalId"},{"column": 1,"type":"name"},{"column": 2,"type":"path"}]`);

console.log(tempFilePath);
const nomer = new Nomer.Nomer(tempFilePath);

console.time("version")
console.log(nomer.version());
console.timeEnd("version")


console.time("append async")
const process = nomer.appendAsync("gbif")
process.stdout.on('data', (data) => {
    const obj = nomer.toObject(data.toString()).filter((obj) => obj.matchType !== "NONE")
    console.log(obj);
})
process.stdout.on('end', () => {
    console.log('append async end');
})

process.stdin.on('error', (e) => {
    console.log('stdin error: ' + e)
});

// process.stdin.write("\tSenegalia\t\n")
process.stdin.write("\tSenegalia\tPlantae\n")
process.stdin.end()


// console.time("append")
// const results = []
// for (let index = 0; index < 100; index++) {
//     results.push(nomer.append("\tBauhinia rufa\t", "gbif"))
// }
// console.timeEnd("append")

// console.time("toObject")
// for (let index = 0; index < results.length; index++) {
//     const element = results[index];
//     nomer.toObject(element)
// }
// console.timeEnd("toObject")
