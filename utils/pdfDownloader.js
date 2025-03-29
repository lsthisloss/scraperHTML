const axios = require('axios');
const fs = require('fs').promises;

async function downloadPdf(url, filename) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        await fs.writeFile(filename, response.data);
    } catch (error) {
        console.error(`Failed to download PDF from ${url}: ${error.message}`);
    }
}

module.exports = { downloadPdf };