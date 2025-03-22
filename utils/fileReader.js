const fs = require('fs');

class FileReader {
    constructor() {
        // Initialization code
    }

    readFile(filePath) {
        try {
            return fs.readFileSync(filePath, 'utf8');
        } catch (error) {
            console.error(`Error reading file ${filePath}:`, error.message);
            return null; // Return null or a default value
        }
    }

    readFileAsync(filePath, callback) {
        fs.readFile(filePath, 'utf8', callback);
    }

    writeFile(filePath, data) {
        fs.writeFileSync(filePath, data, 'utf8');
    }

    writeFileAsync(filePath, data, callback) {
        fs.writeFile(filePath, data, 'utf8', callback);
    }
}

module.exports = FileReader;
