# to-sha1
Convert string or file contents to SHA1.

## installation

```
npm i to-sha1
```

Or, if you use yarn:

```
yarn add to-sha1
```

## usage

```javascript
  const { toSHA1, sha1 } = require('to-sha1')
  
  //Using SHA1 function directly
  //... get file content or text from somewhere ...
  var hashedData = sha1(data);

  //Using toSHA1 to hash a specific file
  toSHA1('filepath', (err, hashedContent) => {
    if(err) console.log(`Something went wrong!`, err)
    console.log(hashedContent) //or do something else...
  })
```

## methods
```javascript
  const { toSHA1, sha1 } = require('to-sha1')
```

### sha1(string)
  Returns the hash of a given string.

### toSHA1(filename, cb)
  Hash a file asynchronously. If there is any error during processing (eg. file doesn't exist, invalid permissions or it is a directory) cb function will be called with the error as first argument.
