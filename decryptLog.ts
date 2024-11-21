import fs from 'fs';
import path from 'path';
import { decrypt } from './src/utils/encryptor';

const logFilePath = path.join(__dirname, './logs/app.log');

fs.readFile(logFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading log file:', err);
    return;
  }

  const lines = data.split('\n').filter((line) => line.trim() !== '');
  const decryptedLogs = lines.map((line) => decrypt(line));
  console.log('Decrypted Logs:\n', decryptedLogs.join('\n'));
});

