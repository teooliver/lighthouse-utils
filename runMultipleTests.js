#!/usr/bin/env node

const execSync = require('child_process').execSync;
const fs = require('fs');
const TEST_OBJ = require('./data'); //config_object
let runs = 0;
let runLimit = 2;

// directory path
const dir = `./${TEST_OBJ.reportsFolder}`;

// create new directory
try {
  // first check if directory already exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    console.log('Directory is created.');
  } else {
    console.log('Directory already exists.');
  }
} catch (err) {
  console.log(err);
}

do {
  console.log(`Running performance test ${runs + 1}`);

  try {
    execSync(
      `lighthouse ${
        TEST_OBJ.websites.controlURL
      } --chrome-flags="--headless" --only-categories="performance" --output=json --output=html --output-path=./${dir}/attract-1639-control-v${
        runs + 1
      }`
    );
    // execSync(
    //   `lighthouse ${
    //     TEST_OBJ.websites.testURL
    //   } --quiet --chrome-flags="--headless" --output=html --output-path=./${dir}/attract-1639-test-v${
    //     runs + 1
    //   }.html`
    // );
  } catch (err) {
    console.log(`Performance test ${runs + 1} failed`);
    console.log(err);
    break;
  }

  console.log(`Finished running performance test ${runs + 1}`);
  runs++;
} while (runs < runLimit);
console.log(`All finished`);
