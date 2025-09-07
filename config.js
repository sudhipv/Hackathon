require('dotenv').config();

const config = {
  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY,
    model: process.env.OPENROUTER_MODEL,
    baseUrl: 'https://openrouter.ai/api/v1'
  },
  heygen: {
    apiKey: process.env.HEYGEN_API_KEY,
    baseUrl: process.env.HEYGEN_BASE_URL || 'https://api.heygen.com/v2'
  }
};

module.exports = config;
