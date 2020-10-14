const fs = require('fs');
const path = require('path');
const scrubData = require('./scrubdata');
const camelToKebab = require('./filename');

const SUCCESS = 0;
const ERR_SYNTAX = 1;
const ERR_FS = 2;

const readSourceFile = sourceFile => {
  let json;

  try {
    json = fs.readFileSync(sourceFile, {encoding: 'utf8'});
  } catch(err){
    console.error(`error while reading ${sourceFile}`);
    throw err;
  }

  let dataObj;
  try {
    dataObj = JSON.parse(json);
  } catch(err){
    console.error(`invalid json in ${sourceFile}`);
    throw err;
  }

  return dataObj;
};

// CamelCase to kebab-case
const generateOutputFilename = sourceFile => {
  let ext = path.extname(sourceFile);
  let name = path.basename(sourceFile, ext);

  let kebabName = camelToKebab(name);

  return `${kebabName}.json`;
};

const saveJson = (jsonObj, destFile) => {
  try {
    fs.writeFileSync(destFile, JSON.stringify(jsonObj, null, 2));
  } catch(err){
    console.error('error while saving data');
    throw err;
  }
};

const scrubFile = (sourceFile, destDir) => {

  let data = readSourceFile(sourceFile);
  let newData = scrubData(data);

  let destFile = generateOutputFilename(sourceFile);

  saveJson(newData, path.join(destDir, destFile));
};

const scrubAllFiles = (sourceDir, destDir) => {
  let files;

  try {
    files = fs.readdirSync(sourceDir);
  } catch(err) {
    console.error(`Error reading content of ${sourceDir}`);
    throw err;
  }

  let fileList = files.filter(file => path.extname(file) === '.json');

  fileList.forEach(file => scrubFile(path.join(sourceDir, file), destDir));
};

const scrub = (source, dest) => {
  let statSource, statDest;
  try {
    statSource = fs.lstatSync(source);
  } catch(err){
    if (err === ENOENT){
      console.error(`${source} doesn\'t exist`);
    }
    throw err;
  }

  try {
    statDest = fs.lstatSync(dest);
  } catch(err){
    if (err === ENOENT){
      console.error(`${dest} doesn\'t exist`);
    }
    throw err;
  }

  if (!statDest.isDirectory()){
    console.error(`${dest} is not a directory`);
    return ERR_FS;
  }

  if (statSource.isDirectory()){
    return scrubAllFiles(source, dest);
  }

  return scrubFile(source, dest);
};


// only run the module if run directly
if (require.main === module) {

  if (process.argv.length < 3 || process.argv.length > 4) {
    console.error('Syntax: node scrub.js <source> <destination>');
    console.error('  <source>: file or directory');
    console.error('  <destination>: directory');
    return ERR_SYNTAX;
  }
  
  return scrub(process.argv[2], process.argv[3] ? process.argv[3] : '.');
}
