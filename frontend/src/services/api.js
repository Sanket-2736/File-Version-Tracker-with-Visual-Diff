import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fileService = {
  // Upload a file
  uploadFile: async (file, uploader, notes, tags) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', file.name);
    if (uploader) formData.append('uploader', uploader);
    if (notes) formData.append('notes', notes);
    if (tags) formData.append('tags', tags);

    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get all files
  getAllFiles: async () => {
    const response = await api.get('/files');
    return response.data;
  },

  // Get all versions of a file
  getFileVersions: async (filename) => {
    const response = await api.get(`/files/${encodeURIComponent(filename)}`);
    return response.data;
  },

  // Get specific version content
  getVersionContent: async (filename, version) => {
    const response = await api.get(`/files/${encodeURIComponent(filename)}/${version}`);
    return response.data;
  },

  // Delete a version
  deleteVersion: async (filename, version) => {
    const response = await api.delete(`/files/${encodeURIComponent(filename)}/${version}`);
    return response.data;
  },
};

export default api;

