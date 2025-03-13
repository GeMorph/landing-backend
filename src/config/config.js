import { initConfig } from "./environments"; // Import the initConfig function

let config = null; // Store the config globally

// Load the configuration asynchronously
export const loadConfig = async () => {
  config = await initConfig(); // Wait for initConfig to finish before proceeding
};

// Get the configuration, throwing an error if not loaded yet
export const getConfig = () => {
  if (!config) throw new Error("Config has not been loaded yet.");
  return config;
};
