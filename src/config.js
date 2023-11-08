const os = require('os');

const platform = os.platform();

module.exports = {
  compilerConfig: {
    nodejs: {
      extension: '.js',
      fileName: (requestId) => `${requestId}.js`,
      deleteFiles: (filePath, fileName) => `${filePath}/${fileName}`,
      command: (filePath, fileName) => {
        switch (platform) {
          case 'linux':
            return `node ${fileName}`
          default:
            return `node ${fileName}`
        }
      }
    },
    java: {
      extension: '.java',
      fileName: (requestId) => `Main_${requestId}.java`,
      deleteFiles: (filePath, fileName) => [
        `${filePath}/${fileName}`,
        `${filePath}/${String(fileName).replace('.java', '.class')}`,
      ],
      sanitize: (text, requestId) => String(text).replace(/^(public class)(.*)({)/i, `public class Main_${requestId} {`),
      command: (filePath, fileName) => {
        switch (platform) {
          case 'linux':
            return `javac ${fileName} && java ${String(fileName).replace('.java', '')}`
          default:
            return `javac ${fileName} && java ${String(fileName).replace('.java', '')}`
        }
      }
    },
  }
}