import React, { useState, useEffect } from 'react';
import { FiFile, FiClock, FiUser, FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { fileService } from '../services/api';

const FileList = ({ onFileSelect }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const data = await fileService.getAllFiles();
      setFiles(data);
    } catch (error) {
      toast.error('Failed to load files');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFiles = files.filter((file) =>
    file.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="card text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p className="text-gray-500 mt-4">Loading files...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FiFile className="text-primary-600" />
          All Files
        </h2>
        <div className="flex-1 max-w-md ml-4">
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      {filteredFiles.length === 0 ? (
        <div className="text-center py-12">
          <FiFile className="mx-auto text-4xl text-gray-300 mb-4" />
          <p className="text-gray-500">
            {searchTerm ? 'No files match your search' : 'No files uploaded yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFiles.map((file, index) => (
            <motion.div
              key={file.filename}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onFileSelect && onFileSelect(file.filename)}
              className="border border-gray-200 rounded-lg p-4 hover:border-primary-400 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FiFile className="text-primary-600 text-xl" />
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {file.filename}
                    </h3>
                    <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs font-medium">
                      v{file.latestVersion}
                    </span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      {file.totalVersions} version{file.totalVersions !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 ml-8">
                    <span className="flex items-center gap-1">
                      <FiClock />
                      {formatDate(file.latestUploadedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiUser />
                      {file.latestUploader || 'Anonymous'}
                    </span>
                  </div>
                </div>

                <FiChevronRight className="text-gray-400 group-hover:text-primary-600 transition-colors text-xl" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default FileList;

