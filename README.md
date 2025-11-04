# File Version Tracker with Visual Diff

A professional MERN stack application for tracking file versions and comparing them with a beautiful visual diff interface.

## 🚀 Features

- **File Upload & Version Management**: Upload text-based files and automatically track versions
- **Visual Diff Comparison**: Side-by-side and unified diff views with syntax highlighting
- **Professional UI**: Modern, responsive design with smooth animations
- **Version History**: View all versions of a file with metadata (uploader, date, tags, notes)
- **Search & Filter**: Easily find files and versions
- **Metadata Support**: Add tags and notes to each version

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **Multer** for file uploads
- **diff-match-patch** for diff computation

### Frontend
- **React.js** 18
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Icons** for icons
- **React Hot Toast** for notifications
- **diff-match-patch** for visual diff rendering

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/file-version-tracker
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
File-Version-Tracker/
│
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   └── FileModel.js        # File version schema
│   ├── routes/
│   │   └── fileRoutes.js       # API routes
│   ├── server.js               # Express server
│   ├── package.json
│   └── .env                    # Environment variables
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUpload.jsx      # File upload component
│   │   │   ├── FileList.jsx        # File list component
│   │   │   ├── VersionList.jsx     # Version list component
│   │   │   └── DiffViewer.jsx      # Diff viewer component
│   │   ├── services/
│   │   │   └── api.js              # API service
│   │   ├── App.jsx                 # Main app component
│   │   ├── index.js                # Entry point
│   │   └── index.css               # Global styles
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md
```

## 🔌 API Endpoints

### Upload File
```
POST /api/files/upload
Content-Type: multipart/form-data

Body:
- file: File
- uploader: string (optional)
- notes: string (optional)
- tags: string (comma-separated, optional)
```

### Get All Files
```
GET /api/files
Returns: Array of file objects with latest version info
```

### Get File Versions
```
GET /api/files/:filename
Returns: Object with filename and array of versions
```

### Get Version Content
```
GET /api/files/:filename/:version
Returns: Version content and metadata
```

### Delete Version
```
DELETE /api/files/:filename/:version
Returns: Success message
```

## 🎨 Usage

1. **Upload a File**: 
   - Go to the Upload tab
   - Drag and drop or click to select a text file
   - Optionally add uploader name, tags, and notes
   - Click "Upload File"

2. **View Files**:
   - Go to the All Files tab
   - Browse all uploaded files
   - Click on a file to view its versions

3. **Compare Versions**:
   - Select a file to view its versions
   - Click the compare icon on two versions
   - Click "Compare Selected" to view the diff
   - Toggle between side-by-side and unified views

4. **View Single Version**:
   - Click the eye icon on any version to view its content

## 🎯 Supported File Types

- Text files (.txt)
- JavaScript (.js, .jsx)
- TypeScript (.ts, .tsx)
- HTML (.html)
- CSS (.css)
- Markdown (.md)
- JSON (.json)
- Python (.py)
- Java (.java)
- C/C++ (.c, .cpp, .h, .hpp)

## 🔧 Configuration

### Backend Environment Variables
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `NODE_ENV`: Environment (development/production)

### Frontend Configuration
- Update `API_URL` in `src/services/api.js` if backend runs on different port
- Or set `REACT_APP_API_URL` environment variable

## 📝 Features in Detail

### Visual Diff
- **Green highlighting**: Added lines
- **Red highlighting**: Removed lines
- **Line numbers**: For easy reference
- **Side-by-side view**: Compare versions side by side
- **Unified view**: Single view with inline changes

### Version Management
- Automatic version numbering
- Metadata tracking (uploader, date, size)
- Tags for organization
- Notes for context
- Version deletion

## 🚧 Future Enhancements

- User authentication (JWT)
- File export (PDF, HTML, Markdown)
- Syntax highlighting for code
- Dark mode toggle
- File comparison history
- Advanced filtering and sorting

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ for efficient file version tracking and comparison.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

