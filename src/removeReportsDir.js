const fs = require('fs');

// delete directory recursively
module.exports = function removeReportsDir(dir) {
  try {
    fs.rmdirSync(dir, { recursive: true });

    console.log(`${dir} is deleted!`);
  } catch (err) {
    console.error(`Error while deleting ${dir}.`);
  }
};
