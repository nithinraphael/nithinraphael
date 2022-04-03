const fs = require('fs');
const minify = require('html-minifier').minify;
const DomParser = require('dom-parser');

const EMBED_HTML_PATH = './embed.html';
const TAILWIND_OUTPUT_PATH = './dist/output.css';
const README_MD_PATH = './README.md'

fs.readFile(EMBED_HTML_PATH, 'utf8', (err, htmlData) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    fs.readFile(TAILWIND_OUTPUT_PATH, 'utf8', (err, cssData) => {
        if (err) {
            console.log(err);
            process.exit(1);
        }

        const domParser = new DomParser();
        const dom = domParser.parseFromString(htmlData);

        if (!dom.getElementsByTagName('body').length) {
            console.log(`Error reading body tag from ${EMBED_HTML_PATH}`)
            process.exit(1);
        }

        const htmlBody = dom.getElementsByTagName('body')[0].innerHTML
        const result = minify(htmlBody, { collapseWhitespace: true }) + `<style>${cssData}</style>`

        fs.writeFile(README_MD_PATH, result, 'utf8', (err) => {
            if (err) {
                console.log(err);
                process.exit(1);
            }
            console.log('Generated Readme successfully');
        });
    });
});
