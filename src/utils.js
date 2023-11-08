const { exec } = require('child_process');
const { writeFile, rm } = require('fs/promises');

function writeToFile(path, text) {
  return writeFile(path, text)
}

function deleteFile(path) {
  if (Array.isArray(path)) {
    return Promise.all(path.map(e => rm(e)))
  }
  return rm(path)
}

function shellExecute(command, cwd) {
  console.log(command, cwd)
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => resolve({ error, stdout, stderr }))
  })
}

module.exports = {
  shellExecute,
  writeToFile,
  deleteFile,
}