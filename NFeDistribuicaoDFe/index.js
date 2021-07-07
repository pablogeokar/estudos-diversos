const fs = require('fs');
const soap = require('soap');
const salvaXML = require('./salvaXML')

const url = 'https://www1.nfe.fazenda.gov.br/NFeDistribuicaoDFe/NFeDistribuicaoDFe.asmx?wsdl'

const args = {
  distDFeInt: {
    attributes: {
      xmlns: 'http://www.portalfiscal.inf.br/nfe',
      versao: '1.01',
    },
    tpAmb: 1,
    cUFAutor: 29,
    CNPJ: '01957614000129',
    distNSU: {
      ultNSU: '000000000000000'
    }
  }
}

const options = {
  wsdl_options: {
    rejectUnauthorized: false,
    strictSSL: false,
    pfx: fs.readFileSync('./certs/certificadoDB.pfx'),
    passphrase: '1234',
  }
}

soap.createClient(url, options, (err, client) => {
  err && console.log('ERRO1', err)

  client.setSecurity(new soap.ClientSSLSecurityPFX('./certs/certificadoDB.pfx', '1234', {
    rejectUnauthorized: false,
    strictSSL: false,
    securityOptions: 'SSL_OP_NO_SSLv3',
    forever: true
  }));

  client.nfeDistDFeInteresse({ nfeDadosMsg: args }, (err, result) => {
    err && console.log('ERRO2', err)

    //let dados = JSON.stringify(result, null, 4)
    let dados = result.nfeDistDFeInteresseResult.retDistDFeInt.loteDistDFeInt.docZip
    let ultNSU = result.nfeDistDFeInteresseResult.retDistDFeInt.ultNSU
    let maxNSU = result.nfeDistDFeInteresseResult.retDistDFeInt.maxNSU

    if (Array.isArray(dados)) {
      dados.map(item => {
        let schema = item.attributes.schema
        if (schema.substr(0, 7) === 'procNFe') {
          salvaXML(item.$value)
        }
      })
    }

    // Salva o arquivo de retorno da consulta
    fs.writeFile(`./result.json`, JSON.stringify(result, null, 4), function (err) {
      if (err) throw err;
    });

    //console.log('>>>\n', JSON.stringify(result, null, 4), '\n<<<');
    console.log('Consulta finalizada')
  })
})
