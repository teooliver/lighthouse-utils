const fs = require('fs');
// const glob = require('glob');

let controlFiles = [];
let testFiles = [];

// glob('reports/*.json', function (er, files) {
//   console.log(files);
//   filePaths = files;
// });
// console.log(filePaths);

//Also nice
function getFilesFromPath(path, extension) {
  let files = fs.readdirSync(path);
  return files.filter((file) =>
    file.match(new RegExp(`.*\.(${extension})`, 'ig'))
  );
}

// console.log(getFilesFromPath('./reports', '.json'));

const filePaths = getFilesFromPath('./reports', '.json');

filePaths.forEach((file) => {
  if (file.includes('control')) {
    controlFiles.push(file);
  } else {
    testFiles.push(file);
  }
});

console.log('control =>', controlFiles);
console.log('test files =>', testFiles);

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
