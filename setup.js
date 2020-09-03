/* eslint-disable */
const fs = require('fs');

const LIB_ROOT = process.argv[2];
const EXPOSE_FILES = process.argv.slice(3);

Promise.all(
  EXPOSE_FILES.map(file =>
    Promise.all([
      new Promise((res, rej) =>
        fs.writeFile(
          `./${file}.js`,
          `module.exports = require('${LIB_ROOT}/${file}');`,
          err => (err ? rej(err) : res())))  
      ,
      new Promise((res, rej) =>
        fs.copyFile(
          `./${LIB_ROOT}/${file}.d.ts`, 
          `./${file}.d.ts`,
          err => (err ? rej(err) : res())))
    ])
  )
);
