const crypto = require('crypto');
const concat = require('concat-stream');
const fs = require('fs');
const path = require('path');

module.exports = { sha1, toSHA1 };

function toSHA1(res) {
  return concat(function(body) {
    if (typeof res === 'undefined') process.stdout.write(sha1(body));
    else res.end(sha1(body));
  });
}

function sha1(str) {
  return crypto
    .createHash('sha1')
    .update(str, 'utf-8')
    .digest('hex');
}

//if called from command line...
if (require.main === module) {
  if (process.argv.length <= 2) return process.stdin.pipe(toSHA1());

  const COMMAND = 2;
  const FILEPATH = 3;

  switch (process.argv[COMMAND]) {
    case '-h':
    case '--help':
      console.log('usage: [-f|--file] <filepath>');
      break;
    case '-f':
    case '--file':
      processFile(process.argv[FILEPATH]);
      break;
    default:
      console.log('invalid argument');
      process.exit(1);
  }
}

function processFile(filepath) {
  if (typeof filepath === 'undefined') {
    console.log('-f requires a file path');
    process.exit(2);
  }

  let file = path.resolve(filepath);

  fs.lstat(file, function(err, stat) {
    if (err) {
      console.log(`${file} is invalid!`);
      process.exit(3);
    }

    if (!stat.isFile()) {
      console.log(`${file} must be a file!`);
      process.exit(4);
    }

    fs.access(file, fs.F_OK, function(err) {
      if (err) {
        console.log(err);
        process.exit(err.code);
      }

      fs.createReadStream(file).pipe(toSHA1());
    });
  });
}
