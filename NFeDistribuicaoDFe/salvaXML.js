const zlib = require('zlib');
const fs = require('fs');
const crypto = require('crypto')

async function salvaXML(value) {
  const buf = Buffer.from(value, 'base64')

  zlib.unzip(buf, function (err, buffer) {
    if (err) throw err;

    let content = buffer.toString('utf8');
    let hash = crypto.createHash('md5').update(content).digest('hex');

    fs.writeFile(`./xmls/${hash}.xml`, content, function (err) {
      if (err) throw err;
    });
  });

}

module.exports = salvaXML








