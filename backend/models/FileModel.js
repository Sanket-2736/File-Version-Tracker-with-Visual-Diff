import mongoose from 'mongoose';

const fileVersionSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
    index: true,
  },
  version: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  uploader: {
    type: String,
    default: 'Anonymous',
  },
  fileType: {
    type: String,
    default: 'text/plain',
  },
  tags: [{
    type: String,
  }],
  notes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true, // creates createdAt & updatedAt automatically
});

fileVersionSchema.index({ filename: 1, version: 1 }, { unique: true });

// Optional: use createdAt for your formatted date
fileVersionSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
});

const FileVersion = mongoose.model('FileVersion', fileVersionSchema);
export default FileVersion;
