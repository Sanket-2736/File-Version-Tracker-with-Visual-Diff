import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import VersionList from './components/VersionList';
import DiffViewer from './components/DiffViewer';
import { FiUpload, FiList, FiGitMerge, FiX } from 'react-icons/fi';
import { fileService } from './services/api';

function App() {
  const [activeView, setActiveView] = useState('upload'); // 'upload', 'files', 'versions'
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [compareVersions, setCompareVersions] = useState(null);

  const handleFileSelect = (filename) => {
    setSelectedFile(filename);
    setActiveView('versions');
  };

  const handleVersionSelect = (version) => {
    setSelectedVersion({ filename: selectedFile, version });
  };

  const handleCompareSelect = (version1, version2) => {
    setCompareVersions({
      filename: selectedFile,
      version1,
      version2,
    });
  };

  const handleUploadSuccess = () => {
    // Optionally switch to files view
  };

  const handleBackToFiles = () => {
    setSelectedFile(null);
    setActiveView('files');
  };

  const handleCloseDiff = () => {
    setCompareVersions(null);
  };

  const handleCloseVersion = () => {
    setSelectedVersion(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary-600 p-2 rounded-lg">
                <FiGitMerge className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">File Version Tracker</h1>
                <p className="text-sm text-gray-500">Track and compare file versions with visual diff</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            <button
              onClick={() => {
                setActiveView('upload');
                setSelectedFile(null);
                setCompareVersions(null);
                setSelectedVersion(null);
              }}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeView === 'upload'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
              }`}
            >
              <FiUpload className="inline mr-2" />
              Upload
            </button>
            <button
              onClick={() => {
                setActiveView('files');
                setSelectedFile(null);
                setCompareVersions(null);
                setSelectedVersion(null);
              }}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeView === 'files'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
              }`}
            >
              <FiList className="inline mr-2" />
              All Files
            </button>
            {selectedFile && (
              <button
                onClick={() => setActiveView('versions')}
                className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                  activeView === 'versions'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                }`}
              >
                <FiGitMerge className="inline mr-2" />
                Versions: {selectedFile}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {compareVersions ? (
            <motion.div
              key="diff"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <DiffViewer
                filename={compareVersions.filename}
                version1={compareVersions.version1}
                version2={compareVersions.version2}
                onClose={handleCloseDiff}
              />
            </motion.div>
          ) : selectedVersion ? (
            <motion.div
              key="version-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <VersionViewer
                filename={selectedVersion.filename}
                version={selectedVersion.version}
                onClose={handleCloseVersion}
              />
            </motion.div>
          ) : activeView === 'upload' ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <FileUpload onUploadSuccess={handleUploadSuccess} />
            </motion.div>
          ) : activeView === 'files' ? (
            <motion.div
              key="files"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <FileList onFileSelect={handleFileSelect} />
            </motion.div>
          ) : activeView === 'versions' ? (
            <motion.div
              key="versions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-4">
                <button
                  onClick={handleBackToFiles}
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
                >
                  ← Back to Files
                </button>
              </div>
              <VersionList
                filename={selectedFile}
                onVersionSelect={handleVersionSelect}
                onCompareSelect={handleCompareSelect}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            File Version Tracker with Visual Diff © 2025
          </p>
        </div>
      </footer>
    </div>
  );
}

// Simple Version Viewer Component
const VersionViewer = ({ filename, version, onClose }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState(null);

  React.useEffect(() => {
    const loadVersion = async () => {
      try {
        const data = await fileService.getVersionContent(filename, version);
        setContent(data.content);
        setMetadata(data);
      } catch (error) {
        console.error('Failed to load version:', error);
      } finally {
        setLoading(false);
      }
    };
    loadVersion();
  }, [filename, version]);

  if (loading) {
    return (
      <div className="card text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p className="text-gray-500 mt-4">Loading version...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {filename} - Version {version}
          </h2>
          {metadata && (
            <p className="text-sm text-gray-500 mt-1">
              Uploaded by {metadata.uploader} on{' '}
              {new Date(metadata.uploadedAt).toLocaleString()}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FiX className="text-xl" />
        </button>
      </div>
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-[600px] overflow-auto">
        <pre className="font-mono text-sm whitespace-pre-wrap break-words">
          {content}
        </pre>
      </div>
    </div>
  );
};

export default App;

