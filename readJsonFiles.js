const fs = require('fs');
const config = require('./config');
const createReportsDir = require('./createReportsDir');

let controlFiles = [];
let testFiles = [];

function getFilesFromPath(path, extension) {
  try {
    let files = fs.readdirSync(path);
    return files.filter((file) =>
      file.match(new RegExp(`.*\.(${extension})`, 'ig'))
    );
  } catch (error) {
    throw 'Path not found, try running runMultipleTests.js first';
    // console.log('Path not found, try running runMultipleTests.js first');
  }
}

// sortFiles()
const filePaths = getFilesFromPath('./reports', '.json');

filePaths.forEach((file) => {
  if (file.includes('avarage-report')) return;
  if (file.includes('control')) {
    controlFiles.push(file);
  } else {
    testFiles.push(file);
  }
});

const getMetricsFromFile = (fileName) => {
  const metricsObj = {};

  const metricsEnum = [
    'first-contentful-paint',
    'speed-index',
    'largest-contentful-paint',
    'interactive',
    'total-blocking-time',
    'cumulative-layout-shift',
  ];

  const jsonFile = fs.readFileSync(`reports/${fileName}`, 'utf8');
  const metrics = JSON.parse(jsonFile);

  metricsObj[metrics.categories['performance'].title] =
    metrics.categories['performance'].score;

  metricsEnum.forEach((metric) => {
    metricsObj[metrics.audits[metric].title] = metrics.audits[metric].score;
  });

  return metricsObj;
};

const getAvaragePerfomance = (files) => {
  let sumMetrics = 0;
  let avarages = {};

  //TODO: Fix: This is being repeated somewhere else.
  const metricsPropsEnum = [
    'Performance',
    'First Contentful Paint',
    'Speed Index',
    'Largest Contentful Paint',
    'Time to Interactive',
    'Total Blocking Time',
    'Cumulative Layout Shift',
  ];

  metricsPropsEnum.forEach((metricProp) => {
    for (let index = 0; index < files.length; index++) {
      const metrics = getMetricsFromFile(files[index]);
      sumMetrics = sumMetrics + metrics[metricProp];
    }
    avarages[metricProp] = sumMetrics / files.length;
  });

  // for (let index = 0; index < files.length; index++) {
  //   const metrics = getMetricsFromFile(files[index]);

  //   sumMetrics = sumMetrics + metrics['Performance'];
  // }

  // avarageMetric = sumMetrics / files.length;

  // return avarageMetric;
  return avarages;
};

let controlPerfomance = getAvaragePerfomance(controlFiles);
let testPerfomance = getAvaragePerfomance(testFiles);

//createAvaragePerfomanceReport(){
const avaragePerformanceReport = JSON.stringify(
  {
    control: { ...controlPerfomance },
    test: { ...testPerfomance },
  },
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
// }

// console.log('avaragePerformanceReport', avaragePerformanceReport);

// console.log('CONTROL ====> ', controlPerfomance);
// console.log('TEST =======> ', testPerfomance);

const metricsTESTPropsEnum = [
  'Performance',
  'First Contentful Paint',
  'Speed Index',
  'Largest Contentful Paint',
  'Time to Interactive',
  'Total Blocking Time',
  'Cumulative Layout Shift',
];

// metricsTESTPropsEnum.forEach((metric) => {
//   if (controlPerfomance[metric] < testPerfomance[metric]) {
//     console.warn(`Control ${metric}  is better!!!`);
//     return;
//   } else {
//     console.info(`Test ${metric}  is better!!!`);
//   }
// });
