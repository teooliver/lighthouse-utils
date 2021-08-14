const fs = require('fs');

let controlFiles = [];
let testFiles = [];

function getFilesFromPath(path, extension) {
  let files = fs.readdirSync(path);
  return files.filter((file) =>
    file.match(new RegExp(`.*\.(${extension})`, 'ig'))
  );
}

const filePaths = getFilesFromPath('./reports', '.json');

filePaths.forEach((file) => {
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

const avaragePerformanceReport = JSON.stringify(
  {
    control: { ...controlPerfomance },
    test: { ...testPerfomance },
  },
  null,
  2
);

fs.writeFile(
  './avarage-report.json',
  avaragePerformanceReport,
  'utf8',
  (err) => {
    if (err) {
      console.log(`Error writing file: ${err}`);
    } else {
      console.log(`Final avarage report is written successfully!`);
    }
  }
);

console.log('avaragePerformanceReport', avaragePerformanceReport);

console.log('CONTROL ====> ', controlPerfomance);
console.log('TEST =======> ', testPerfomance);

const metricsTESTPropsEnum = [
  'Performance',
  'First Contentful Paint',
  'Speed Index',
  'Largest Contentful Paint',
  'Time to Interactive',
  'Total Blocking Time',
  'Cumulative Layout Shift',
];

metricsTESTPropsEnum.forEach((metric) => {
  if (controlPerfomance[metric] < testPerfomance[metric]) {
    console.log(`Control ${metric}  is better!!!`);
    return;
  } else {
    console.log(`Test ${metric}  is better!!!`);
  }
});
