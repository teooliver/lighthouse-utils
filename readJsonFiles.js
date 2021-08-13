const fs = require('fs');
const glob = require('glob');

glob('reports/*.json', function (er, files) {
  console.log(files);
  // files is an array of filenames.
  // If the `nonull` option is set, and nothing
  // was found, then files is ["**/*.js"]
  // er is an error object or null.
});

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
  'reports/attract-1639-control-v1.report.json',
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
