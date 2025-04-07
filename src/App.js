import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';

// Import all your components and pages
import SignUp from './components/signup';
import Login from './components/login';
import HomePage from './pages/Home';
import Watch from './pages/Watch';
import Profile from './pages/Profile';
import Search from './pages/Search';
import UploadVideo from './pages/UploadVideo';
import Dashboard from './pages/Dashboard';
import Uploads from './pages/Uploads';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import EditVideo from './pages/EditVideo';
import LikedVideos from './pages/LikedVideos';
import SavedVideos from './pages/SavedVideos';
import YourVideos from './pages/MyVideos';
import NotFound from './components/NotFound';
import Playlists from './pages/Playlists';
import PlaylistVideos from './pages/PlaylistVideos';
import History from './pages/History';

import { SearchQueryProvider } from './contexts/SearchQueryContext';
import { SocketProvider, useSocket } from './contexts/SocketContext';
import Notifications from './pages/Notifications';

function App() {
  const { socket, loading } = useSocket();
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification(prev => ({ ...prev, open: false }));
  };

  useEffect(() => {
    if (socket) {
      socket.on('new-notification', (notification) => {
        setNotification({
          open: true,
          
          message: notification.title || "You have a new notification!",
          severity: 'info'
        });
      });

      return () => {
        socket.off('new-notification');
      };
    }
  }, [socket]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <SearchQueryProvider>
        <Routes>
          <Route path="/create-account" element={<SignUp/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/' element={<HomePage/>} />
          <Route path='*' element={<NotFound/>} />
          <Route path='/watch/:id' element={<Watch/>} />
          <Route path='/profile/:id' element={<Profile/>} />
          <Route path='/notifications' element={<Notifications/>}></Route>
          <Route path='/liked-videos' element={<LikedVideos/>} />
          <Route path='/saved-videos' element={<SavedVideos/>} />
          <Route path='/your-videos' element={<YourVideos/>} />
          <Route path='/playlists' element={<Playlists/>} />
          <Route path='/playlist/:id/videos' element={<PlaylistVideos/>} />
          <Route path='/history' element={<History/>} />
          <Route path='/search' element={<Search/>} />
          <Route path='/studio/upload-video' element={<UploadVideo/>} />
          <Route path='/studio/edit-video/:id' element={<EditVideo/>} />
          <Route path='studio/dashboard' element={<Dashboard/>} />
          <Route path='/studio/settings' element={<Settings/>} />
          <Route path='/studio/analytics' element={<Analytics/>} />
          <Route path='/studio/uploads' element={<Uploads/>} />
        </Routes>
        
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={notification.open}
          autoHideDuration={5000}
          onClose={handleCloseNotification}
        >
          <Alert 
            onClose={handleCloseNotification}
            severity={notification.severity}
            sx={{ width: '100%',fontFamily:"Velyra",fontWeight:"bold"}}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </SearchQueryProvider>
    </BrowserRouter>
  );
}

function AppWrapper() {
  return (
    <SocketProvider>
      <App />
    </SocketProvider>
  );
}

export default AppWrapper;