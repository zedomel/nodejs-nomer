import { Nomer } from '../src/index';
import readline from "readline";
import fs from "fs"

describe('Nomer Integration Tests', () => {
    let nomer;

    beforeAll(() => {
        // Initialize Nomer instance
        nomer = new Nomer();
    });

    describe('version', () => {
        it('should return nomer version string', () => {
            const result = nomer.version();
            expect(result).toBeTruthy();
            expect(result).toContain('0.5.17');
        });
    });

    describe('properties', () => {
        it('should return properties configuration', () => {
            const result = nomer.properties();
            expect(result).toBeTruthy();
            expect(result).toContain('nomer.');
        });
    });

    describe('inputSchema', () => {
        it('should return input schema', () => {
            const result = nomer.inputSchema();
            expect(result).toBeTruthy();
            // Should be valid JSON
            expect(() => JSON.parse(result)).not.toThrow();
        });
    });

    describe('outputSchema', () => {
        it('should return output schema', () => {
            const result = nomer.outputSchema();
            expect(result).toBeTruthy();
            // Should be valid JSON
            expect(() => JSON.parse(result)).not.toThrow();
        });
    });

    describe('matcher', () => {
        it('should return list of matchers in tsv format', () => {
            const result = nomer.matcher();
            expect(result).toBeTruthy();
            expect(result).toContain('col'); // TSV format
        });

        it('should return list of matchers in json format', () => {
            const result = nomer.matcher('json');
            expect(result).toBeTruthy();
            expect(() => JSON.parse(result)).not.toThrow();
        });

        it('should return verbose matcher information', () => {
            const result = nomer.matcher('tsv', true);
            expect(result).toBeTruthy();
            expect(result).toContain('col');
        });
    });

    describe('append', () => {
        it('should append taxonomic information for valid species', () => {
            const result = nomer.append('\tHomo sapiens\t', 'col');
            expect(result).toBeTruthy();
            expect(result).toContain('HAS_ACCEPTED_NAME');
        });

        it('should return result in json format', () => {
            const result = nomer.append('\tHomo sapiens\t', 'col', 'json');
            expect(result).toBeTruthy();
            expect(() => JSON.parse(result)).not.toThrow();
        });

        it('should handle invalid taxa gracefully', () => {
            const result = nomer.append('\tInvalidTaxonXYZ123\t', 'col');
            expect(result).toBeTruthy();
            expect(result).toContain('NONE');
        });
    });

    describe('replace', () => {
        it('should replace query with matched taxonomic information', () => {
            const result = nomer.replace('\tHomo sapiens\t', 'col');
            expect(result).toBeTruthy();
            expect(result).toContain('COL:6MB3T')
        });

        it('should handle invalid taxa', () => {
            const query = '\tInvalidtaxonXYZ123\t';
            const result = nomer.replace(query, 'col');
            expect(result).toBeTruthy();
            expect(result).toContain('null');
        });
    });

    describe('appendAsync', () => {
        it('should return a spawn process', (done) => {
            const process = nomer.appendAsync('col');

            expect(process).toBeTruthy();
            expect(process.stdin).toBeTruthy();
            expect(process.stdout).toBeTruthy();
            expect(process.stderr).toBeTruthy();

            let output = '';

            process.stdout.on('data', (data) => {
                output += data.toString();
            });

            process.on('close', (code) => {
                expect(code).toBe(0);
                expect(output).toBeTruthy();
                expect(output).toContain('HAS_ACCEPTED_NAME');
                done();
            });

            // Write test data and close stdin
            process.stdin.write('\tHomo sapiens\t\n');
            process.stdin.end();
        }, 10000);

        it('should handle streaming multiple queries', (done) => {
            const process = nomer.appendAsync('col');

            let output = '';

            process.stdout.on('data', (data) => {
                output += data.toString();
            });

            process.on('close', (code) => {
                expect(code).toBe(0);
                expect(output).toBeTruthy();
                // Each line should be valid JSON
                const lines = output.trim().split('\n');
                lines.forEach(line => {
                    if (line.trim()) {
                        expect(line).toContain('HAS_ACCEPTED_NAME');
                    }
                });
                done();
            });

            // Write multiple queries
            process.stdin.write('\tHomo sapiens\t\n');
            process.stdin.write('\tCanis lupus\t\n');
            process.stdin.end();
        }, 10000);
    });

    it('should handle streaming multiple queries in json', (done) => {
        const process = nomer.appendAsync('col', 'json');

        let output = '';

        process.stdout.on('data', (data) => {
            output += data.toString();
        });

        process.on('close', (code) => {
            expect(code).toBe(0);
            expect(output).toBeTruthy();
            // Each line should be valid JSON
            const lines = output.trim().split('\n');
            lines.forEach(line => {
                if (line.trim()) {
                    expect(() => JSON.parse(line)).not.toThrow();
                }
            });
            done();
        });

        // Write multiple queries
        process.stdin.write('\tHomo sapiens\t\n');
        process.stdin.write('\tCanis lupus\t\n');
        process.stdin.end();
    }, 10000);

    it('should handle streaming multiple wht pipe split', (done) => {
        const process = nomer.appendAsync('col');

        let output = [];

        const rl = readline.createInterface({ input: process.stdout });
        rl.on('line', (line) => {
            const trimmed = line.replace(/\r$/, ''); // strip CR if present
            if (trimmed.length > 0) {
                output.push(trimmed);
            }
        });

        process.on('close', (code) => {
            expect(code).toBe(0);
            expect(output).toBeTruthy();
            // Each line should be valid JSON
            output.forEach(line => {
                if (line.trim()) {
                    expect(line).toMatch(/HAS_ACCEPTED_NAME|SYNONYM_OF/);
                }
            });
            done();
        });

        // Write multiple queries
        process.stdin.write('\tHomo sapiens\t\n');
        process.stdin.write('\tCanis lupus\t\n');
        process.stdin.write('\tBauhinia acuminata\t\n');
        process.stdin.end();
    }, 10000);

    // describe('clean', () => {
    //     it('should execute clean command', () => {
    //         const result = nomer.clean();
    //         // Clean may return empty or success message
    //         expect(result !== null).toBe(true);
    //     });
    // });

    describe('Nomer with custom properties', () => {
        it('should use custom properties file', () => {
            // Create a nomer instance with properties
            const tempFile = './test/test.properties';
            try {
                fs.writeFileSync(tempFile, 'nomer.test.property=value\n');
                const customNomer = new Nomer(tempFile);
                const result = customNomer.properties();
                expect(result).toBeTruthy();
                expect(result).toContain('nomer.test.property=value');
            } finally {
                fs.unlinkSync(tempFile);
            }
        });

        it('should use custom echo option', () => {
            const customNomer = new Nomer(null, '-n');
            const result = customNomer.append('\Homo sapiens\t');
            expect(result).toBeTruthy();
        });
    });

    describe('toJson', () => {
        it('should convert result to json', () => {
            const tsvResult = nomer.append('\tHomo sapiens\t', 'col', 'json');
            const jsonResult = nomer.toJson(tsvResult);
            expect(jsonResult).toBeTruthy();
            expect(Array.isArray(jsonResult)).toBe(true);
            if (jsonResult.length > 0) {
                expect(typeof jsonResult[0]).toBe('object');
                expect(jsonResult[0]).toHaveProperty('species');
            }
        });
    });

    describe('toArray', () => {
        it('should convert result to array', () => {
            const result = nomer.append('\tHomo sapiens\t', 'col');
            const arrayResult = nomer.toArray(result);
            expect(arrayResult).toBeTruthy();
            expect(Array.isArray(arrayResult)).toBe(true);
        });

        it('should convert result to array with custom columns', () => {
            const result = nomer.append('\tHomo sapiens\t', 'col');
            const columns = ['id', 'name'];
            const arrayResult = nomer.toArray(result, columns);
            expect(arrayResult).toBeTruthy();
            expect(Array.isArray(arrayResult)).toBe(true);
            if (arrayResult.length > 0) {
                expect(arrayResult[0]).toHaveProperty('id');
                expect(arrayResult[0]).toHaveProperty('name');
            }
        });

        it('should convert  streaming result to array', (done) => {
            const process = nomer.appendAsync('col');

            let output = '';
            process.stdout.on('data', (data) => {
                if (data.toString().trim())
                    output += data.toString();
            });

            process.on('close', (code) => {
                expect(code).toBe(0);
                expect(output).toBeTruthy();
                const arrayResult = nomer.toArray(output);
                expect(arrayResult).toBeTruthy();
                expect(Array.isArray(arrayResult)).toBe(true);
                // Each line should be valid JSON
                arrayResult.forEach(arr => {
                    expect(arr[3]).toMatch(/HAS_ACCEPTED_NAME|SYNONYM_OF/);
                });
                done();
            });

            // Write multiple queries
            process.stdin.write('\tHomo sapiens\t\n');
            process.stdin.write('\tCanis lupus\t\n');
            process.stdin.write('\tBauhinia acuminata\t\n');
            process.stdin.end();
        }, 10000);
    });

    describe('toObject', () => {
        it('should convert result to object with schema', () => {
            const result = nomer.append('\tHomo sapiens\t', 'col');
            const objectResult = nomer.toObject(result);
            expect(objectResult).toBeTruthy();
            expect(Array.isArray(objectResult)).toBe(true);
            if (objectResult.length > 0) {
                expect(typeof objectResult[0]).toBe('object');
            }
        });
    });

    describe('getPropertiesPath', () => {
        it('should return null when no properties path is set', () => {
            const testNomer = new Nomer();
            expect(testNomer.getPropertiesPath()).toBe(null);
        });

        it('should return properties path when set', () => {
            const testNomer = new Nomer('./test.properties');
            expect(testNomer.getPropertiesPath()).toBe('./test.properties');
        });
    });
});