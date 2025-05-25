const fs = require("fs");

function loadTLSCredentials() {
  const keyPath = process.env.TLS_KEY_PATH;
  const crtPath = process.env.TLS_CRT_PATH;

  if (!keyPath || !crtPath) {
    console.warn(
      "[tslConfig.js] {loadTLSCredentials()} : TLS certificates not provided. Falling back to HTTP."
    );
    return null;
  }

  try {
    const key = fs.readFileSync(keyPath, "utf8");
    const cert = fs.readFileSync(crtPath, "utf8");
    return { key, cert };
  } catch (err) {
    console.warn(
      "[tslConfig.js] {loadTLSCredentials()} : Error loading TLS certificates. Falling back to HTTP."
    );
    return null;
  }
}

module.exports = {
  loadTLSCredentials,
};
