import * as d from '../declarations';
import { createRequestHandler } from './request-handler';
import { findClosestOpenPort } from './find-closest-port';
import * as http from 'http';
import * as https from 'https';
import * as crypto from 'crypto';
import { promisify } from 'util';

export async function createHttpServer(devServerConfig: d.DevServerConfig, fs: d.FileSystem, destroys: d.DevServerDestroy[]) {
  // figure out the port to be listening on
  // by figuring out the first one available
  devServerConfig.port = await findClosestOpenPort(devServerConfig.address, devServerConfig.port);

  // create our request handler
  const reqHandler = createRequestHandler(devServerConfig, fs);

  let server: http.Server;

  if (devServerConfig.https) {
    const credentials = typeof devServerConfig.https === 'object'
      ? devServerConfig.https
      : await generateCredentials();

    server = https.createServer(credentials, reqHandler);
  } else {
    server = http.createServer(reqHandler);
  }

  destroys.push(() => {
    // close down the serve on destroy
    server.close();
    server = null;
  });

  return server;
}

async function generateCredentials(): Promise<d.Credentials> {
  const generateKeyPair = promisify(crypto.generateKeyPair);

  const { publicKey, privateKey } = await generateKeyPair('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });

  const cert = generateCert(publicKey, privateKey);

  return { key: privateKey, cert };
}

function generateCert(publicKey: string, privateKey: string) {
  const forge = require('../sys/node/node-forge') as Forge;

  const cert = forge.createCertificate();

  cert.publicKey = forge.publicKeyFromPem(publicKey);
  cert.serialNumber = '01';
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

  const attributes = [
    { name: 'commonName', value: 'localhost' },
    { name: 'countryName', value: 'US' },
    { shortName: 'ST', value: 'Wisconsin' },
    { name: 'localityName', value: 'Madison' },
    { name: 'organizationName', value: 'Ionic' },
    { shortName: 'OU', value: 'Stencil' }
  ];

  cert.setSubject(attributes);
  cert.setIssuer(attributes);

  cert.sign(forge.privateKeyFromPem(privateKey));

  return forge.certificateToPem(cert);
}

interface Forge {
  createCertificate: () => any;
  certificateToPem: (cert: any) => any;
  publicKeyFromPem: (pem: string) => any;
  privateKeyFromPem: (pem: string) => any;
}
