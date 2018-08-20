import * as fs from 'fs';
import {DevServerSSLConfig} from '../declarations';
// import getDevelopmentCertificate from 'devcert-san';

export async function getSSL(sslConfig: DevServerSSLConfig) {
  // const cert: any = await installSSL();
  return {
    cert: fs.readFileSync(sslConfig.certPath, 'utf-8'),
    key: fs.readFileSync(sslConfig.keyPath, 'utf-8')
  };
}

// async function installSSL() {
//   try {
//     //  Certificates are cached by name, so two calls for getDevelopmentCertificate('foo')  will return the same key and certificate
//     return getDevelopmentCertificate('stencil-dev-server-ssl', {
//       installCertutil: true
//     });
//   } catch (err) {
//     throw new Error(`Failed to generate dev SSL certificate: ${err}\n`);
//   }
// }
