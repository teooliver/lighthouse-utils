# lighthouse-utils

This program will run multiple lighthouse tests and compare between a control and test branches.

Make the `runMultipleTests.js` executable from the terminal:

`chmod a+x src/runMultipleTests.js`

Create a `config.js` inside the `src` folder following the `config.example.js` file.

Run the script: `src/runMultipleTests.js`

This will create reports folder with `html` and `json` lighthouse reports, plus the `avarage-report.json` with the avarage performance numbers for control and tests.
