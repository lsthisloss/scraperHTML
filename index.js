const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const { createDirectory, filesNumber } = require('./utils/utils');
const { downloadPdf } = require('./utils/pdfDownloader');

const directoryPath = './Catalogues';

async function scrapeCatalogs() {
    try {
        const response = await axios.get('https://www.tus.si/aktualno/katalogi-in-revije/', {
            timeout: 30000
        });
        const $ = cheerio.load(response.data);
        const catalogs = [];
        $('.catalogues-grid .list-item').each((index, element) => {
            const catalog = {
                name: $(element).find('h3').text().trim(),
                link: $(element).find('.pdf').attr('href'),
                validity: $(element).find('p').text().trim()
            };
            if (catalog.name && catalog.link && catalog.validity) {
                catalogs.push(catalog);

            }
        });

        const cataloguesObject = { catalogues: catalogs };
        const cataloguesJson = JSON.stringify(cataloguesObject, null, 2);
        await fs.writeFile('catalogues.json', cataloguesJson);
        console.log(`Catalogs successfully saved to catalogues.json`);
        console.log(`Total catalogs: ${catalogs.length}`);

        for (const catalog of catalogs) {
            console.log(`Downloading ${catalog.name} ...`);
            const filename = `${directoryPath}/${catalog.name}.pdf`;
            await downloadPdf(catalog.link, filename);
        }

        const totalPdfFiles = await filesNumber(directoryPath);
        console.log(`Total PDF files downloaded: ${totalPdfFiles} out of ${catalogs.length}`);

    } catch (error) {
        console.error('Error:', error);
    }
}

async function main() {
    await createDirectory(directoryPath);
    await scrapeCatalogs();
    console.log('Work is done!');
}

main();

