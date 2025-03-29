const fs = require('fs').promises;

async function createDirectory(path) {
    try {
        await fs.mkdir(path, { recursive: true });
    } catch (error) {
        console.error(`Failed to create directory: ${error.message}`);
    }
}
async function filesNumber(directoryPath) {
    const files = await fs.readdir(directoryPath);
    const pdfFiles = files.filter(file => file.endsWith('.pdf'));
    return pdfFiles.length;
}
module.exports = { createDirectory, filesNumber };