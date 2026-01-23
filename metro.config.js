// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Обход проблемы с node:sea на Windows
config.resolver = {
  ...config.resolver,
  unstable_enablePackageExports: false,
};

module.exports = config;

