import React, { useState, useEffect } from 'react';
import { FiFile, FiClock, FiUser, FiTrash2, FiEye, FiGitMerge } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { fileService } from '../services/api';

const VersionList = ({ filename, onVersionSelect, onCompareSelect }) => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersions, setSelectedVersions] = useState([]);

  useEffect(() => {
    if (filename) {
      loadVersions();
    }
  }, [filename]);

  const loadVersions = async () => {
    try {
      setLoading(true);
      const data = await fileService.getFileVersions(filename);
      setVersions(data.versions || []);
    } catch (error) {
      toast.error('Failed to load versions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVersionClick = (version) => {
    if (onVersionSelect) {
      onVersionSelect(version);
    }
  };

  const handleCompareToggle = (version) => {
    setSelectedVersions((prev) => {
      if (prev.includes(version)) {
        return prev.filter((v) => v !== version);
      } else if (prev.length < 2) {
        return [...prev, version];
      } else {
        return [prev[1], version];
      }
    });
  };

  const handleCompare = () => {
    if (selectedVersions.length === 2) {
      const sorted = [...selectedVersions].sort((a, b) => a - b);
      if (onCompareSelect) {
        onCompareSelect(sorted[0], sorted[1]);
      }
    } else {
      toast.error('Please select exactly 2 versions to compare');
    }
  };

  const handleDelete = async (version) => {
    if (window.confirm(`Are you sure you want to delete version ${version}?`)) {
      try {
        await fileService.deleteVersion(filename, version);
        toast.success('Version deleted successfully');
        loadVersions();
      } catch (error) {
        toast.error('Failed to delete version');
      }
    }
  };

  if (!filename) {
    return (
      <div className="card text-center py-12">
        <FiFile className="mx-auto text-4xl text-gray-300 mb-4" />
        <p className="text-gray-500">Select a file to view its versions</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p className="text-gray-500 mt-4">Loading versions...</p>
      </div>
    );
  }

  if (versions.length === 0) {
    return (
      <div className="card text-center py-12">
        <FiFile className="mx-auto text-4xl text-gray-300 mb-4" />
        <p className="text-gray-500">No versions found for this file</p>
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
          {filename}
        </h2>
        {selectedVersions.length === 2 && (
          <button
            onClick={handleCompare}
            className="btn-primary flex items-center gap-2"
          >
            <FiGitMerge />
            Compare Selected
          </button>
        )}
      </div>

      <div className="space-y-3">
        {versions.map((version, index) => {
          const isSelected = selectedVersions.includes(version.version);
          return (
            <motion.div
              key={version.version}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`border rounded-lg p-4 transition-all ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">
                      Version {version.version}
                    </span>
                    {version.tags && version.tags.length > 0 && (
                      <div className="flex gap-2">
                        {version.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <FiClock />
                      {version.formattedDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiUser />
                      {version.uploader || 'Anonymous'}
                    </span>
                    <span>{(version.size / 1024).toFixed(2)} KB</span>
                  </div>
                  
                  {version.notes && (
                    <p className="text-sm text-gray-500 mt-2 italic">
                      {version.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleVersionClick(version.version)}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="View version"
                  >
                    <FiEye />
                  </button>
                  <button
                    onClick={() => handleCompareToggle(version.version)}
                    className={`p-2 rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                    title="Select for comparison"
                  >
                    <FiGitMerge />
                  </button>
                  <button
                    onClick={() => handleDelete(version.version)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete version"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default VersionList;

