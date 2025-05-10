const fs = require('fs');

function loadTLSCredentials() {
  const keyPath = process.env.TLS_KEY_PATH;
  const crtPath = process.env.TLS_CRT_PATH;

  if (!keyPath || !crtPath) {
    console.warn('TLS certificates not provided. Falling back to HTTP.');
    return null; // indicamos que no hay certificados
  }

  try {
    const key = fs.readFileSync(keyPath, 'utf8');
    const cert = fs.readFileSync(crtPath, 'utf8');
    return { key, cert };
  } catch (err) {
    console.warn('Error loading TLS certificates. Falling back to HTTP.', err);
    return null;
  }
}

module.exports = {
  loadTLSCredentials
};