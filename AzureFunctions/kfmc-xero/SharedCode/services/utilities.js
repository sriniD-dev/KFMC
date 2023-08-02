const fs = require('fs')
const writeJsonLogs = (fileName, data) => {
  const promise = new Promise((resolve, reject) => {
    fs.writeFile(`./logs/${fileName}`, JSON.stringify(data), err => {
      if(err)
      {
        reject(err)
        return err
      }

      let msg = 'File stored successfully.'
      resolve(msg)
      return msg
    })
  })
  return promise
}

module.exports.writeJsonLogs = writeJsonLogs

const delay = (seconds) => {
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      let result = `Waited for ${seconds} seconds`
      resolve(result)
      return result
    }, seconds*1000)
  })
  return promise
}

module.exports.delay = delay