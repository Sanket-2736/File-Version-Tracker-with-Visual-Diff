import React, { useState, useEffect } from 'react';
import { FiX, FiCode, FiColumns, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { DiffMatchPatch } from 'diff-match-patch';
import toast from 'react-hot-toast';
import { fileService } from '../services/api';

const DiffViewer = ({ filename, version1, version2, onClose }) => {
  const [content1, setContent1] = useState('');
  const [content2, setContent2] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('split'); // 'split' or 'unified'
  const [diffLines, setDiffLines] = useState([]);
  const [lineNumbers, setLineNumbers] = useState({ left: [], right: [] });

  useEffect(() => {
    if (filename && version1 && version2) {
      loadVersions();
    }
  }, [filename, version1, version2]);

  const loadVersions = async () => {
    try {
      setLoading(true);
      const [v1, v2] = await Promise.all([
        fileService.getVersionContent(filename, version1),
        fileService.getVersionContent(filename, version2),
      ]);

      setContent1(v1.content);
      setContent2(v2.content);
      computeDiff(v1.content, v2.content);
    } catch (error) {
      toast.error('Failed to load versions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const computeDiff = (text1, text2) => {
    const dmp = new DiffMatchPatch();
    const diffs = dmp.diff_main(text1, text2);
    dmp.diff_cleanupSemantic(diffs);

    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');

    if (viewMode === 'split') {
      computeSplitDiff(diffs, lines1, lines2);
    } else {
      computeUnifiedDiff(diffs, lines1, lines2);
    }
  };

  const computeSplitDiff = (diffs, lines1, lines2) => {
    const leftLines = [];
    const rightLines = [];
    const leftLineNums = [];
    const rightLineNums = [];

    // Convert diffs to line-based format
    let lineNum1 = 1;
    let lineNum2 = 1;

    diffs.forEach(([operation, text]) => {
      const lines = text.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        const isLastLine = i === lines.length - 1;
        const line = lines[i];

        if (operation === -1) {
          // Deleted from left
          if (line || !isLastLine) {
            leftLines.push({ text: line || '', type: 'removed' });
            leftLineNums.push(lineNum1++);
            rightLines.push({ text: '', type: 'empty' });
            rightLineNums.push(null);
          }
        } else if (operation === 1) {
          // Added to right
          if (line || !isLastLine) {
            leftLines.push({ text: '', type: 'empty' });
            leftLineNums.push(null);
            rightLines.push({ text: line || '', type: 'added' });
            rightLineNums.push(lineNum2++);
          }
        } else {
          // Unchanged
          if (line || !isLastLine) {
            leftLines.push({ text: line || '', type: 'normal' });
            leftLineNums.push(lineNum1++);
            rightLines.push({ text: line || '', type: 'normal' });
            rightLineNums.push(lineNum2++);
          }
        }
      }
    });

    setDiffLines({ left: leftLines, right: rightLines });
    setLineNumbers({ left: leftLineNums, right: rightLineNums });
  };

  const computeUnifiedDiff = (diffs, lines1, lines2) => {
    const result = [];
    let lineNum = 1;

    diffs.forEach(([operation, text]) => {
      const textLines = text.split('\n');
      
      for (let i = 0; i < textLines.length; i++) {
        const isLastLine = i === textLines.length - 1;
        const line = textLines[i];

        let type = 'normal';
        if (operation === -1) type = 'removed';
        else if (operation === 1) type = 'added';

        if (line || !isLastLine) {
          result.push({ text: line || '', type, lineNum: lineNum++ });
        }
      }
    });

    setDiffLines({ unified: result });
  };

  useEffect(() => {
    if (content1 && content2) {
      computeDiff(content1, content2);
    }
  }, [viewMode, content1, content2]);

  if (loading) {
    return (
      <div className="card text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p className="text-gray-500 mt-4">Loading diff...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FiCode className="text-primary-600" />
            Diff Comparison
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {filename} - Version {version1} vs Version {version2}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('split')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'split'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FiColumns className="inline mr-2" />
              Side by Side
            </button>
            <button
              onClick={() => setViewMode('unified')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'unified'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FiCode className="inline mr-2" />
              Unified
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="text-xl" />
          </button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {viewMode === 'split' ? (
          <div className="grid grid-cols-2 divide-x divide-gray-200 max-h-[600px] overflow-auto">
            {/* Left Side - Version 1 */}
            <div className="bg-gray-50">
              <div className="sticky top-0 bg-gray-100 border-b border-gray-200 px-4 py-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700">
                    Version {version1}
                  </span>
                  <span className="text-xs text-gray-500">Original</span>
                </div>
              </div>
              <div className="font-mono text-sm">
                {diffLines.left?.map((line, idx) => (
                  <div
                    key={idx}
                    className={`diff-line flex ${
                      line.type === 'removed'
                        ? 'diff-line-removed'
                        : line.type === 'normal'
                        ? 'diff-line-normal'
                        : 'bg-gray-50'
                    }`}
                  >
                    <span className="diff-line-number">
                      {lineNumbers.left[idx] || ''}
                    </span>
                    <span className="flex-1 whitespace-pre-wrap break-words">
                      {line.text || '\u00A0'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Version 2 */}
            <div className="bg-white">
              <div className="sticky top-0 bg-gray-100 border-b border-gray-200 px-4 py-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700">
                    Version {version2}
                  </span>
                  <span className="text-xs text-gray-500">Modified</span>
                </div>
              </div>
              <div className="font-mono text-sm">
                {diffLines.right?.map((line, idx) => (
                  <div
                    key={idx}
                    className={`diff-line flex ${
                      line.type === 'added'
                        ? 'diff-line-added'
                        : line.type === 'normal'
                        ? 'diff-line-normal'
                        : 'bg-gray-50'
                    }`}
                  >
                    <span className="diff-line-number">
                      {lineNumbers.right[idx] || ''}
                    </span>
                    <span className="flex-1 whitespace-pre-wrap break-words">
                      {line.text || '\u00A0'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-h-[600px] overflow-auto bg-white">
            <div className="font-mono text-sm">
              {diffLines.unified?.map((line, idx) => (
                <div
                  key={idx}
                  className={`diff-line flex ${
                    line.type === 'added'
                      ? 'diff-line-added'
                      : line.type === 'removed'
                      ? 'diff-line-removed'
                      : 'diff-line-normal'
                  }`}
                >
                  <span className="diff-line-number">{line.lineNum}</span>
                  <span className="flex-1 whitespace-pre-wrap break-words">
                    {line.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-50 border-l-4 border-green-500"></div>
          <span className="text-gray-600">Added</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-50 border-l-4 border-red-500"></div>
          <span className="text-gray-600">Removed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border-l-4 border-transparent"></div>
          <span className="text-gray-600">Unchanged</span>
        </div>
      </div>
    </motion.div>
  );
};

export default DiffViewer;

