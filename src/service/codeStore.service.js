const codeStore = new Map();

function setCode(email, code) {
  codeStore.set(email, { code: String(code) });
}

function getCode(email) {
  return codeStore.get(email);
}

function deleteCode(email) {
  codeStore.delete(email);
}

function hasCode(code) {
  return [...codeStore.values()].some(e => String(e.code) === String(code));
}

module.exports = {
  setCode,
  getCode,
  deleteCode,
  hasCode,
};