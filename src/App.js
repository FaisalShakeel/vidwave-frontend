import logo from './logo.svg';
import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import SignUp from './components/signup';
import Login from './components/login';
import HomePage from './pages/Home';
import Watch from './pages/Watch';
import Profile from './pages/Profile';
import Search from './pages/Search';
import UploadVideo from './pages/UploadVideo';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Uploads from './pages/Uploads';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import { SearchQueryProvider } from './contexts/SearchQueryContext';
import EditVideo from './pages/EditVideo';

function App() {
  return (
    <BrowserRouter>
    <SearchQueryProvider>
    <Routes>
      <Route path="/createaccount" element={<SignUp/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/'  element={<HomePage/>}></Route>
      <Route path='/watch/:id' element={<Watch/>}></Route>
      <Route path='/profile/:id' element={<Profile/>}></Route>
      <Route path='/search' element={<Search/>}></Route>
      <Route path='/studio/upload-video' element={<UploadVideo/>}></Route>
      <Route path='/studio/edit-video/:id' element={<EditVideo/>}></Route>
      <Route path='studio/dashboard' element={
        <Dashboard/>
      } ></Route>
      <Route path='/studio/settings' element={<Settings/>}></Route>
      <Route path='/studio/analytics' element={<Analytics/>}></Route>

      <Route path='/studio/uploads' element={<Uploads/>}></Route>
      </Routes>
      </SearchQueryProvider>
      </BrowserRouter>
      
  )
}

export default App;
