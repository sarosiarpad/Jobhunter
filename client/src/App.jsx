import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import JobDetails from './pages/JobDetails';
import AddJob from './pages/AddJob';
import './App.css';
import { useAuthenticateUserMutation } from './services/api';
import { useDispatch } from 'react-redux';
import { setUserInfo, setUserToken } from './slices/userSlice';

function App() {
  const dispatch = useDispatch();
  const [authenticateUser] = useAuthenticateUserMutation();

  useEffect(() => {
    const savedUser = JSON.parse(window.localStorage.getItem("savedUser"));
    if (savedUser) {
      const authenticate = async () => {
        try {
          const response = await authenticateUser({
            email: savedUser.email,
            password: savedUser.password,
            strategy: "local"
          });

          if (response.data) {
            dispatch(setUserToken(response.data.accessToken));
            dispatch(setUserInfo({
              id: response.data.user.id,
              email: response.data.user.email,
              name: response.data.user.fullname,
              role: response.data.user.role
            }));
          }
        } catch (error) {
          console.error('Failed to authenticate saved user:', error);
        }
      };

      authenticate();
    }
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<SignIn />} />
        <Route path='/register' element={<SignUp />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/jobs/:id' element={<JobDetails />} />
        <Route path='/add-job' element={<AddJob />} />
      </Routes>
    </>
  );
}

export default App;
