const { execSync, spawn } = require('child_process');
import { runNomer, runNomerAsync, getNomerSimpleCmd, getNomerValidateCmd, getNomerMatchCmd } from "../src/utils";

// Mock child_process
jest.mock('child_process');

describe('utils', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Suppress console.log in tests
        jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterEach(() => {
        console.log.mockRestore();
    });

    describe('getNomerValidateCmd', () => {
        it('should throw error when filepath is empty string', () => {
            expect(() => getNomerValidateCmd("")).toThrow();
        });

        it('should generate basic validate command', () => {
            const result = getNomerValidateCmd("/path/to/file");
            expect(result).toBe("curl -L /path/to/file | nomer validate-term");
        });

        it('should generate validate command with custom cmd', () => {
            const result = getNomerValidateCmd("/path/to/file", "validate-term-link");
            expect(result).toBe("curl -L /path/to/file | nomer validate-term-link");
        });

        it('should generate validate command with properties', () => {
            const result = getNomerValidateCmd("/path/to/file", "validate-term", "props.properties");
            expect(result).toBe("curl -L /path/to/file | nomer validate-term -p props.properties");
        });
    });

    describe('getNomerMatchCmd', () => {
        it('should generate basic match command without query', () => {
            const result = getNomerMatchCmd();
            expect(result).toBe("nomer append globi-taxon-cache");
        });

        it('should generate match command with query', () => {
            const result = getNomerMatchCmd("Homo sapiens");
            expect(result).toBe("echo -e 'Homo sapiens' | nomer append globi-taxon-cache");
        });

        it('should generate match command with custom echo option', () => {
            const result = getNomerMatchCmd("Homo sapiens", "append", "globi-taxon-cache", null, null, "-n");
            expect(result).toBe("echo -n 'Homo sapiens' | nomer append globi-taxon-cache");
        });

        it('should generate match command with properties', () => {
            const result = getNomerMatchCmd("", "append", "globi-taxon-cache", "props.properties");
            expect(result).toBe("nomer append globi-taxon-cache -p props.properties");
        });

        it('should generate match command with output format', () => {
            const result = getNomerMatchCmd("", "append", "globi-taxon-cache", null, "json");
            expect(result).toBe("nomer append globi-taxon-cache -o json");
        });

        it('should generate match command with all options', () => {
            const result = getNomerMatchCmd("Homo sapiens", "replace", "custom-matcher", "props.properties", "json", "-e");
            expect(result).toBe("echo -e 'Homo sapiens' | nomer replace custom-matcher -p props.properties -o json");
        });
    });

    describe('getNomerSimpleCmd', () => {
        it('should generate basic version command', () => {
            const result = getNomerSimpleCmd();
            expect(result).toBe("nomer version");
        });

        it('should generate command with custom cmd', () => {
            const result = getNomerSimpleCmd("clean");
            expect(result).toBe("nomer clean");
        });

        it('should generate command with properties', () => {
            const result = getNomerSimpleCmd("version", false, "props.properties");
            expect(result).toBe("nomer version -p props.properties");
        });

        it('should generate command with output format', () => {
            const result = getNomerSimpleCmd("version", false, null, "json");
            expect(result).toBe("nomer version -o json");
        });

        it('should generate command with verbose flag', () => {
            const result = getNomerSimpleCmd("version", true);
            expect(result).toBe("nomer version -v");
        });

        it('should generate command with all options', () => {
            const result = getNomerSimpleCmd("matchers", true, "props.properties", "tsv");
            expect(result).toBe("nomer matchers -p props.properties -o tsv -v");
        });
    });

    describe('runNomer', () => {
        it('should execute command and return trimmed result', () => {
            const mockResult = Buffer.from('result output\n\n');
            execSync.mockReturnValue(mockResult);

            const result = runNomer('nomer version');

            expect(execSync).toHaveBeenCalledWith('nomer version', {
                maxBuffer: 4096 * 4096
            });
            expect(result).toBe('result output');
        });

        it('should return null on error and log message', () => {
            const mockError = new Error('Command failed');
            execSync.mockImplementation(() => {
                throw mockError;
            });

            const result = runNomer('nomer version');

            expect(console.log).toHaveBeenCalledWith('Error running nomer cmd: Command failed');
            expect(result).toBe(null);
        });

        it('should handle empty result', () => {
            execSync.mockReturnValue(Buffer.from(''));

            const result = runNomer('nomer version');

            expect(result).toBeUndefined();
        });

        it('should trim whitespace from result', () => {
            const mockResult = Buffer.from('  result with spaces  \n\t');
            execSync.mockReturnValue(mockResult);

            const result = runNomer('nomer version');

            expect(result).toBe('  result with spaces');
        });
    });

    describe('runNomerAsync', () => {
        it('should spawn process with correct arguments', () => {
            const mockProcess = { stdout: {}, stderr: {}, stdin: {} };
            spawn.mockReturnValue(mockProcess);

            const result = runNomerAsync('nomer append globi-taxon-cache');

            expect(spawn).toHaveBeenCalledWith('nomer', ['append', 'globi-taxon-cache'], {
                shell: true
            });
            expect(result).toBe(mockProcess);
        });

        it('should handle complex commands with multiple arguments', () => {
            const mockProcess = { stdout: {}, stderr: {}, stdin: {} };
            spawn.mockReturnValue(mockProcess);

            const result = runNomerAsync('nomer append globi-taxon-cache -p props.properties -o json');

            expect(spawn).toHaveBeenCalledWith('nomer', ['append', 'globi-taxon-cache', '-p', 'props.properties', '-o', 'json'], {
                shell: true
            });
            expect(result).toBe(mockProcess);
        });

        it('should split command on whitespace', () => {
            const mockProcess = { stdout: {}, stderr: {}, stdin: {} };
            spawn.mockReturnValue(mockProcess);

            runNomerAsync('echo -e test | nomer version');

            expect(spawn).toHaveBeenCalledWith('echo', ['-e', 'test', '|', 'nomer', 'version'], {
                shell: true
            });
        });
    });
});