const initConfig = require("./environments");

let config = null; // Store the config globally

// Load the configuration asynchronously
const loadConfig = async () => {
  config = await initConfig(); // Wait for initConfig to finish before proceeding
};

// Get the configuration, throwing an error if not loaded yet
const getConfig = () => {
  if (!config) throw new Error("Config has not been loaded yet.");
  return config;
};

module.exports = { loadConfig, getConfig };
