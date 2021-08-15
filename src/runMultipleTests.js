#!/usr/bin/env node

const execSync = require('child_process').execSync;
const createReportsDir = require('./createReportsDir');

const config = require('./config');
let runs = 0;

// directory path
const dir = config.reportsFolder;

// TODO: remove all folders and files related to previous tests

createReportsDir(dir);

//Run lighthouse tests
do {
  console.log(`Running performance test ${runs + 1}`);

  try {
    execSync(
      `lighthouse ${
        config.websites.controlURL
      } --quiet --chrome-flags="--headless" --only-categories="performance" --output=json --output=html --output-path=./${dir}/attract-1639-control-v${
        runs + 1
      }`
    );
    execSync(
      `lighthouse ${
        config.websites.testURL
      } --quiet --chrome-flags="--headless" --only-categories="performance" --output=json --output=html --output-path=./${dir}/attract-1639-test-v${
        runs + 1
      }`
    );
  } catch (err) {
    console.log(`Performance test ${runs + 1} failed`);
    console.log(err);
    break;
  }

  console.log(`Finished running performance test ${runs + 1}`);
  runs++;
} while (runs < config.runLimit);
console.log(`All finished`);

execSync(`node src/readJsonFiles.js`);
