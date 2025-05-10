const { execSync } = require('child_process');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const modelsDir = path.join(__dirname, 'src', 'models');

if (fs.existsSync(modelsDir)) {
  fs.rmSync(modelsDir, { recursive: true, force: true });
  console.log('Old models removed.');
}

const cmd = `npx sequelize-auto -h ${process.env.DB_HOST} -d ${process.env.DB_NAME} -u ${process.env.DB_USER_DEV} -p ${process.env.DB_PORT} -x ${process.env.DB_PASS_DEV} -e mysql -o ./src/models`;

try {
  console.log('Generating models with sequelize-auto...');
  execSync(cmd, { stdio: 'inherit' });
  console.log('Models generated successfully.');
} catch (error) {
  console.error('Failed to generate models:', error.message);
}
