const fs = require('fs');
const path = require('path');
const targetDir = path.join(__dirname, '../../.expo/metro/externals');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}
