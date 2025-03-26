/** @type {import('jest').Config} */
module.exports = {
  // Use the default Create React App Jest configuration
  preset: 'react-scripts/jest',
  
  // Transform the axios module to CommonJS
  transformIgnorePatterns: [
    "/node_modules/(?!axios).+"
  ]
}; 