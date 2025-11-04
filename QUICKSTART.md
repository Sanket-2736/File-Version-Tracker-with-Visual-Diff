# Quick Start Guide

Follow these steps to get the File Version Tracker up and running quickly.

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js (v14 or higher) installed
- ✅ MongoDB installed and running (or MongoDB Atlas account)
- ✅ npm or yarn package manager

## Step 1: Start MongoDB

### Option A: Local MongoDB
```bash
# On Windows
net start MongoDB

# On macOS/Linux
mongod
```

### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and get your connection string
3. Update the `.env` file with your connection string

## Step 2: Backend Setup

1. Open a terminal and navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
# Copy the example file
copy .env.example .env   # Windows
# or
cp .env.example .env     # macOS/Linux
```

4. Edit `.env` and set your MongoDB URI:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/file-version-tracker
NODE_ENV=development
```

5. Start the backend server:
```bash
npm run dev
```

You should see: `Server running on port 5000` and `MongoDB Connected`

## Step 3: Frontend Setup

1. Open a **new terminal** and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

The browser should automatically open to `http://localhost:3000`

## Step 4: Test the Application

1. **Upload a file**:
   - Go to the Upload tab
   - Select a text file (`.txt`, `.js`, `.md`, etc.)
   - Optionally add your name, tags, and notes
   - Click "Upload File"

2. **View files**:
   - Go to the All Files tab
   - You should see your uploaded file

3. **Upload another version**:
   - Go back to Upload tab
   - Upload the same file again (with modifications)
   - This will create version 2

4. **Compare versions**:
   - Click on your file from the All Files tab
   - Select two versions using the compare icons
   - Click "Compare Selected"
   - View the visual diff!

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify the `.env` file exists and has correct MongoDB URI
- Check if port 5000 is available

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify `proxy` in `frontend/package.json` points to `http://localhost:5000`

### MongoDB connection errors
- Verify MongoDB is running: `mongosh` or check MongoDB Compass
- For Atlas: Ensure your IP is whitelisted
- Check connection string format

### Port already in use
- Change `PORT` in backend `.env` file
- Update frontend `proxy` in `package.json` to match

## Production Build

### Build Frontend
```bash
cd frontend
npm run build
```

### Run Backend in Production
```bash
cd backend
npm start
```

## Need Help?

- Check the main README.md for detailed documentation
- Review the API endpoints in the README
- Check browser console and terminal for error messages

Happy tracking! 🚀

