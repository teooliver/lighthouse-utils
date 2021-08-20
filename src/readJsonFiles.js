const fs = require('fs');
const config = require('./config');
const createReportsDir = require('./utils/createReportsDir');

let controlFiles = [];
let testFiles = [];

const lighthousePerfomanceMetrics = [
  'first-contentful-paint',
  'speed-index',
  'largest-contentful-paint',
  'interactive',
  'total-blocking-time',
  'cumulative-layout-shift',
];

function getJsonFilesFromPath(path, extension) {
  try {
    let files = fs.readdirSync(path);
    return files.filter((file) =>
      file.match(new RegExp(`.*\.(${extension})`, 'ig'))
    );
  } catch (error) {
    throw 'Path not found, try running runMultipleTests.js first';
  }
}

function sortFiles() {
  const filePaths = getJsonFilesFromPath('./reports', '.json');

  filePaths.forEach((file) => {
    if (file.includes('avarage-report')) return;
    if (file.includes('control')) {
      controlFiles.push(file);
      // Move to control folder?
    } else {
      testFiles.push(file);
      // Move to test folder?
    }
  });
}
sortFiles();

const getMetricsFromFile = (fileName) => {
  const metricsObj = {};

  const jsonFile = fs.readFileSync(`reports/${fileName}`, 'utf8');
  const metrics = JSON.parse(jsonFile);

  metricsObj[metrics.categories['performance'].title] =
    metrics.categories['performance'].score;

  lighthousePerfomanceMetrics.forEach((metric) => {
    if (metric == 'cumulative-layout-shift') {
      metricsObj[metrics.audits[metric].id] = parseFloat(
        metrics.audits[metric].displayValue.trim()
      );
    }
    if (metric == 'total-blocking-time') {
      metricsObj[metrics.audits[metric].id] = parseFloat(
        metrics.audits[metric].displayValue.split('m')[0].trim()
      );
    } else {
      metricsObj[metrics.audits[metric].id] = parseFloat(
        metrics.audits[metric].displayValue.split('s')[0].trim()
      );
    }
  });

  return metricsObj;
};

// TODO: Fix and write tests
const getAvaragePerfomance = (files) => {
  let avarages = {};

  const metricsProps = ['Performance', ...lighthousePerfomanceMetrics];

  metricsProps.forEach((metricProp) => {
    let sumMetrics = 0;
    for (let index = 0; index < files.length; index++) {
      const metrics = getMetricsFromFile(files[index]);
      sumMetrics = sumMetrics + metrics[metricProp];
    }
    avarages[metricProp] = (sumMetrics / files.length).toFixed(2);
  });

  return avarages;
};

const createAvaragePerfomanceReport = () => {
  let controlPerfomance = getAvaragePerfomance(controlFiles);
  let testPerfomance = getAvaragePerfomance(testFiles);

  const avaragePerformanceReport = JSON.stringify(
    [
      { branch: 'control', ...controlPerfomance },
      { branch: 'test', ...testPerfomance },
    ],
    null,
    2
  );

  createReportsDir(config.reportsFolder);

  fs.writeFile(
    'reports/avarage-report.json',
    avaragePerformanceReport,
    'utf8',
    (err) => {
      if (err) {
        console.log(`Error writing file: ${err}`);
      } else {
        console.log(`Final avarage report was created successfully!`);
      }
    }
  );
};

createAvaragePerfomanceReport();
