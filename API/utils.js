const fs = require("fs");

function writeData(filename, content) {
  fs.writeFileSync(filename, JSON.stringify(content), "utf8", (err) => {
    if (err) console.log(err);
  });
}

function getPostData(req){
  return new Promise ((resolve, reject) => {
    try {
      let body = ''

      req.on('data', (chunk) => {
        body += chunk.toString()
      })

      req.on('end', () => {
        resolve(body)
      })
    } catch (error){
      reject(error)
    }
  })
}

function getBoundary(request) {
  let contentType = request.headers['content-type']
  const contentTypeArray = contentType.split(';').map(item => item.trim())
  const boundaryPrefix = 'boundary='
  let boundary = contentTypeArray.find(item => item.startsWith(boundaryPrefix))
  if (!boundary) return null
  boundary = boundary.slice(boundaryPrefix.length)
  if (boundary) boundary = boundary.trim()
  return boundary
}

function getMatching(string, regex) {
  // Helper function when using non-matching groups
  const matches = string.match(regex)
  if (!matches || matches.length < 2) {
    return null
  }
  return matches[1]
}



module.exports =  {
    writeData,
    getPostData,
    getBoundary,
    getMatching
}