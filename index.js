const crypto = require('crypto');
const concat = require('concat-stream');
const fs = require('fs');
const path = require('path');
const through = require('through2');

module.exports = { sha1, toSHA1 };

function toSHA1(filename, cb) {
  checkFileValidity(filename, (err, file) => {
    if (err) cb(err);
    fs.createReadStream(file).pipe(createWriteStream(cb));
  });
}

function sha1(str) {
  return crypto
    .createHash('sha1')
    .update(str, 'utf-8')
    .digest('hex');
}

function createWriteStream(cb) {
  return concat(body => cb(null, sha1(body)));
}

function checkFileValidity(filepath, cb) {
  if (typeof filepath === 'undefined')
    cb(new Error(`filepath can't be undefined`));

  let file = path.resolve(filepath);

  fs.lstat(file, (err, stat) => {
    if (err) cb(new Error(`Invalid file: ${file}`));

    if (!stat.isFile()) cb(new Error(`${file} must be a file!`));

    fs.access(file, fs.F_OK, err => {
      if (err) cb(err);
      cb(null, file);
    });
  });
}

//if called from command line...
if (require.main === module) {
  if (process.argv.length <= 2) {
    return process.stdin
      .pipe(
        through((chunk, enc, next) => {
          next(null, sha1(chunk.toString()));
        })
      )
      .pipe(process.stdout);
  }

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
  toSHA1(filepath, (err, messageDigest) => {
    if (err) {
      console.log(`Unable to process file: ${err}`);
      process.exit(2);
    }

    console.log(messageDigest);
  });
}
