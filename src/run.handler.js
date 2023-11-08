const { shellExecute, writeToFile, deleteFile } = require("./utils")
const uuid = require('uuid');
const { compilerConfig } = require("./config");

async function compile(requestId, langConfig, logicText) {
  const filePath = __dirname + `/temp`;
  const fileName = langConfig.fileName(requestId)
  const fullFilePath = `${filePath}/${fileName}`
  await writeToFile(fullFilePath, logicText);
  const output = await shellExecute(langConfig.command(filePath, fileName), filePath);
  await deleteFile(langConfig.deleteFiles(filePath, fileName));
  return { output, filePath: fullFilePath }
}

function prepareOutput(text, { filePath }) {
  const filePathRegex = new RegExp(filePath, 'ig');
  // Hide filename in response for security concerns
  return String(text, filePath).replace(filePathRegex, '<filename>').trim().split('\n')
}

function sanitizeInputText(langConfig, text, requestId) {
  text = String(text).trim()
  text = langConfig.sanitize ? langConfig.sanitize(text, requestId) : text;
  return text;
}

async function handler(req, res, next) {
  const response = {
    compilerOutput: "",
    executionStatus: false
  }
  const { logicText } = req.body
  const requestId = uuid.v4().replace(/-/ig, ''); 
  const langConfig = compilerConfig[req.params.lang]
  console.log(langConfig)
  if (langConfig) {
    const executableScript = sanitizeInputText(langConfig, logicText, requestId);
    const { output: compilerOutput, filePath } = await compile(requestId, langConfig, executableScript)
    console.log(compilerOutput)
    if (compilerOutput.stdout) {
      response.executionStatus = true;
      response.compilerOutput = prepareOutput(compilerOutput.stdout, { filePath });
    } else if (compilerOutput.stderr) {
      response.compilerOutput = prepareOutput(compilerOutput.stderr, { filePath });
    } else if (compilerOutput.error) {
      response.compilerOutput = compilerOutput.error
    }
  } else {
    response.error = new Error('Language is not supported!')
  }
  res.json(response)
}

async function wrapper(req, res, next) {
  try {
    await handler(req, res, next)
  } catch (error) {
    console.log(error)
    res.json({
      error
    })
  }
}

module.exports = {
  handler: wrapper
}