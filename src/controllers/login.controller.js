const { loginService } = require('../service/login.service');

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const { token } = await loginService({ username, password });
    return res.status(200).json({ token });
  } catch (error) {
    console.warn(`Error al enviar código a ${username}:`, error.message);
    return res.status(401).json({ message: error.message });
  }
};

module.exports = {
  loginUser
};
