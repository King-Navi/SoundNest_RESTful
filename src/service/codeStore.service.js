const codeStore = new Map();

function setCode(email, code) {
  const cleanedEmail = email.trim().toLowerCase();
  codeStore.set(cleanedEmail, { code: String(code) });
}

function getCode(email) {
  const cleanedEmail = email.trim().toLowerCase();
  return codeStore.get(cleanedEmail);
}

function deleteCode(email) {
  const cleanedEmail = email.trim().toLowerCase();
  codeStore.delete(cleanedEmail);
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