const fs = require('fs');
const soap = require('soap');

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

var options = {
  wsdl_options: {
    rejectUnauthorized: false,
    strictSSL: false,
    pfx: fs.readFileSync('./certs/certificadoDB.pfx'),
    //ca: fs.readFileSync('./certs/ca.pem'), // Autoridade certificadora Receita Federal
    //key: fs.readFileSync('./certs/key.pem'),
    passphrase: '1234',
    //securityOptions: 'SSL_OP_NO_SSLv3'
  }
}

const url = 'https://www1.nfe.fazenda.gov.br/NFeDistribuicaoDFe/NFeDistribuicaoDFe.asmx?wsdl';

soap.createClient(url, options, (err, client) => {
  err && console.log('ERRO1', err)

  //client.addHttpHeader('Content-Type', `text/xml; charset=utf-8`);

  client.setSecurity(new soap.ClientSSLSecurityPFX('./certs/certificadoDB.pfx', '1234', {
    rejectUnauthorized: false,
    strictSSL: false,
    //secureOptions: 'SSL_OP_NO_TLSv1_2',
    securityOptions: 'SSL_OP_NO_SSLv3',
    forever: true
  }));

  client.nfeDistDFeInteresse({ nfeDadosMsg: args }, (err, result) => {
    err && console.log('ERRO2', err)

    console.log('>>>\n', JSON.stringify(result, null, 4), '\n<<<');
  })

})

