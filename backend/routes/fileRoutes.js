import express from 'express';
import multer from 'multer';
import FileVersion from '../models/FileModel.js';

const router = express.Router();

// Configure multer for memory storage (text-based files only)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'text/plain',
      'text/javascript',
      'text/html',
      'text/css',
      'text/markdown',
      'application/json',
      'text/x-python',
      'text/x-java',
      'text/x-c',
      'text/x-c++',
    ];
    if (
      allowedTypes.includes(file.mimetype) ||
      /\.(txt|js|jsx|ts|tsx|html|css|md|json|py|java|c|cpp|h|hpp)$/i.test(
        file.originalname
      )
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only text-based files are allowed'), false);
    }
  },
});

// ✅ POST /api/files/upload - Upload a new file or version
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { filename } = req.body;
    const fileContent = req.file.buffer.toString('utf-8');
    const fileSize = req.file.size;
    const uploader = req.body.uploader || 'Anonymous';
    const notes = req.body.notes || '';
    const tags = req.body.tags
      ? req.body.tags.split(',').map((t) => t.trim())
      : [];

    // Find current highest version
    const existingVersions = await FileVersion.find({ filename }).sort({
      version: -1,
    });
    const nextVersion =
      existingVersions.length > 0 ? existingVersions[0].version + 1 : 1;

    // Create new version
    const fileVersion = new FileVersion({
      filename: filename || req.file.originalname,
      version: nextVersion,
      content: fileContent,
      size: fileSize,
      uploader,
      fileType: req.file.mimetype,
      notes,
      tags,
    });

    await fileVersion.save();

    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        id: fileVersion._id,
        filename: fileVersion.filename,
        version: fileVersion.version,
        size: fileVersion.size,
        uploadedAt: fileVersion.createdAt, // ✅ current timestamp
        uploader: fileVersion.uploader,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload file' });
  }
});

// ✅ GET /api/files - List all unique files with latest version
router.get('/', async (req, res) => {
  try {
    const files = await FileVersion.aggregate([
      { $sort: { filename: 1, version: -1 } },
      {
        $group: {
          _id: '$filename',
          latestVersion: { $first: '$version' },
          latestUploadedAt: { $first: '$createdAt' }, // ✅ use createdAt
          totalVersions: { $sum: 1 },
          latestUploader: { $first: '$uploader' },
          fileType: { $first: '$fileType' },
        },
      },
      {
        $project: {
          _id: 0,
          filename: '$_id',
          latestVersion: 1,
          latestUploadedAt: 1,
          totalVersions: 1,
          latestUploader: 1,
          fileType: 1,
        },
      },
      { $sort: { latestUploadedAt: -1 } },
    ]);

    res.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

// ✅ GET /api/files/:filename - Get all versions of a file
router.get('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const versions = await FileVersion.find({ filename })
      .sort({ version: 1 })
      .select('version createdAt size uploader tags notes fileType')
      .lean();

    if (versions.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json({
      filename,
      versions: versions.map((v) => ({
        ...v,
        formattedDate: new Date(v.createdAt).toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      })),
    });
  } catch (error) {
    console.error('Error fetching file versions:', error);
    res.status(500).json({ error: 'Failed to fetch file versions' });
  }
});

// ✅ GET /api/files/:filename/:version - Get a specific version
router.get('/:filename/:version', async (req, res) => {
  try {
    const { filename, version } = req.params;
    const fileVersion = await FileVersion.findOne({
      filename,
});

// ✅ GET /api/files/:filename/:version - Get a specific version
router.get('/:filename/:version', async (req, res) => {
      version: parseInt(version),
    });

    if (!fileVersion) {
      return res.status(404).json({ error: 'Version not found' });
    }

    res.json({
      filename: fileVersion.filename,
      version: fileVersion.version,
      content: fileVersion.content,
      size: fileVersion.size,
      uploadedAt: fileVersion.createdAt, // ✅ consistent timestamp
      uploader: fileVersion.uploader,
      fileType: fileVersion.fileType,
      tags: fileVersion.tags,
      notes: fileVersion.notes,
    });
  } catch (error) {
    console.error('Error fetching version:', error);
    res.status(500).json({ error: 'Failed to fetch version' });
  }
});

// ✅ DELETE /api/files/:filename/:version - Delete specific version
router.delete('/:filename/:version', async (req, res) => {
  try {
    const { filename, version } = req.params;
    const deleted = await FileVersion.findOneAndDelete({
      filename,
      version: parseInt(version),
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Version not found' });
    }

    res.json({ message: 'Version deleted successfully' });
  } catch (error) {
    console.error('Error deleting version:', error);
    res.status(500).json({ error: 'Failed to delete version' });
  }
});

export default router;
