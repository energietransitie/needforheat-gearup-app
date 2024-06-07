const fs = require('fs-extra');
const path = require('path');

const rootRNPath = path.resolve(__dirname, 'node_modules', 'react-native');
const expoRNPath = path.resolve(__dirname, 'apps', 'expo', 'node_modules', 'react-native');

try {
  // Check if the destination path exists and is a directory
  if (fs.existsSync(expoRNPath) && fs.statSync(expoRNPath).isDirectory()) {
    // Remove the existing directory to ensure it's replaced by the new one
    fs.removeSync(expoRNPath);
  }
  
  // Copy the React Native module to the expo/node_modules directory
  fs.copySync(rootRNPath, expoRNPath);
  console.log('React Native copied successfully.');
} catch (error) {
  console.error('Error copying React Native:', error);
  process.exit(1);
}
