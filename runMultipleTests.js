#!/usr/bin/env node

const execSync = require('child_process').execSync;
const fs = require('fs');
// TODO: Change TEST_OBJ name to config_object maybe?
const TEST_OBJ = require('./data'); //config_object
let runs = 0;
let runLimit = 3;
// directory path
const dir = TEST_OBJ.reportsFolder;

// TODO: remove all folders and files related to previous tests

// create reports directory
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
      } --quiet --chrome-flags="--headless" --only-categories="performance" --output=json --output=html --output-path=./${dir}/attract-1639-control-v${
        runs + 1
      }`
    );
    execSync(
      `lighthouse ${
        TEST_OBJ.websites.testURL
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
} while (runs < runLimit);
console.log(`All finished`);
