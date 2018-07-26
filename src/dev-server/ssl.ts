import * as fs from 'fs';
import getDevelopmentCertificate from 'devcert-san';


export async function getSSL() {
  const cert: any = await installSSL();
  return {
    key: fs.readFileSync(cert.keyPath, 'utf-8'),
    cert: fs.readFileSync(cert.certPath, 'utf-8')
  };
}

async function installSSL() {
  try {
    //  Certificates are cached by name, so two calls for getDevelopmentCertificate('foo')  will return the same key and certificate
    return getDevelopmentCertificate('stencil-dev-server-ssl', {
      installCertutil: true
    });

  } catch (err) {
    throw new Error(`Failed to generate dev SSL certificate: ${err}\n`);
  }
}
