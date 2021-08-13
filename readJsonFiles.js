const fs = require('fs');

const categories = ['performance'];

const metricsEnum = [
  'first-contentful-paint',
  'speed-index',
  'largest-contentful-paint',
  'interactive',
  'total-blocking-time',
  'cumulative-layout-shift',
];

const jsonFile = fs.readFileSync(
  './reports/attract-1639-control-v1.report.json',
  'utf8'
);

const metrics = JSON.parse(jsonFile);

console.log(
  metrics.categories['performance'].title +
    ' | ' +
    metrics.categories['performance'].score
);
metricsEnum.forEach((metric) =>
  console.log(
    metrics.audits[metric].title + ' | ' + metrics.audits[metric].score
  )
);
