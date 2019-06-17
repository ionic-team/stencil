const { createCertificate, certificateToPem, publicKeyFromPem } = require('node-forge/lib/x509');
const { privateKeyFromPem } = require('node-forge/lib/pki');

exports.createCertificate = createCertificate;
exports.certificateToPem = certificateToPem;
exports.publicKeyFromPem = publicKeyFromPem;
exports.privateKeyFromPem = privateKeyFromPem;
