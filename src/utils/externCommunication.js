const axios = require('axios');
require('dotenv').config(); 

class RestClient {
  constructor(token = null) {
    const host = process.env.HOST_GRPC_DOCKER || 'localhost';
    const port = process.env.SECOND_PORT_GRPC || '9999';
    const baseURL = `http://${host}:${port}`;
    this.client = axios.create({
      baseURL,
      timeout: 5000,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  async get(path, params = {}) {
    try {
      const response = await this.client.get(path, { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async post(path, data = {}) {
    try {
      const response = await this.client.post(path, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async put(path, data = {}) {
    try {
      const response = await this.client.put(path, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(path) {
    try {
      const response = await this.client.delete(path);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      console.warn(`REST Error: ${error.response.status} - ${error.response.data}`);
      throw new Error(`REST error: ${error.response.status}`);
    } else if (error.request) {
      console.warn('No response received:', error.request);
      throw new Error('No response from server');
    } else {
      console.warn('Request setup error:', error.message);
      throw new Error('Request setup failed');
    }
  }
}

module.exports = RestClient;
