# VDF.js

Convert Valve's KeyValue format to JSON

## Install

`npm install vdfjs`

## Usage

### In a script

```javascript
var fs = require('fs');
var vdf = require('vdfjs');
var someFile = fs.readFileSync('path/to/file.txt', 'utf-8');

var data = vdf.parse(someFile); // Returns a JS object representing the input file

console.log(JSON.stringify(data)); // Prints the JSON version of someFile.
```

### CLI

First, install it globally: `npm install -g vdfjs`

Then, `vdfjs path_to_file --out outfile.json`

## Note

This repo is a work in progress. Expect updated...everything...soon.
