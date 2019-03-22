#!/usr/bin/env node

const { toSHA1, sha1 } = require('../index');
const through = require('through2');

const COMMAND = 2;
const FILEPATH = 3;

if (process.argv.length <= 2) {
  return process.stdin
    .pipe(
      through((chunk, enc, next) => {
        next(null, sha1(chunk.toString()));
      })
    )
    .pipe(process.stdout);
}

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

function processFile(filepath) {
  toSHA1(filepath, (err, messageDigest) => {
    if (err) {
      console.log(`Unable to process file: ${err}`);
      process.exit(2);
    }

    console.log(messageDigest);
  });
}
