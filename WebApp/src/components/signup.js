import React, { useState } from 'react';
import './signup.css';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import TextField from '@mui/material/TextField';
import { Hidden, Snackbar, Alert } from '@mui/material';
import cam from './image/image.png';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { orange } from '@mui/material/colors';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConPassword = () => {
    setShowConPassword(!showConPassword);
  };

  const theme = createTheme({
    typography: {
      fontFamily: ['Poppins'].join(','),
    },
    palette: {
      secondary: {
        main: orange[500],
      },
    },
  });

  const handleEmailSubmit = () => {
    localStorage.setItem('email', email);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
      localStorage.setItem('email', email);
      localStorage.setItem('password', password);
      navigate('/verify');
    }
  };

  const handleCloseSnackbar = () => {
    setPasswordError(false);
  };

  return (
    <div className="bodySignup">
      <ThemeProvider theme={theme}>
        <Hidden smDown>
          <div className="context">
            <header>Sign up to</header>
            <h1>ALL-D</h1>
            <p>Affordable Life Logging Device</p>

            <text style={{ marginTop: '2em' }}>If you already have an account,{' '}</text>
            <text> you can 
              <Link to="/" style={{ color: '#FFB545', textDecoration: 'none' }}> Sign in here!</Link>
            </text>
          </div>
          <div className="concam">
            <img src={cam} alt="bullet point" style={{ borderRadius: '20px', rotate: '10deg' }} />
          </div>
        </Hidden>
        <div className="container">
          <form onSubmit={handleFormSubmit}>
            <p style={{ marginBottom: '7px' }}>Email</p>
            <TextField
              id="standard-basic"
              label="Enter your email"
              sx={{
                borderRadius: '8px',
                '& label': { fontFamily: 'Poppins', fontWeight: 'lighter', fontSize: '13px', textAlign: 'center' },
              }}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              onBlur={handleEmailSubmit}
            />
            <p style={{ marginTop: '20px', marginBottom: '7px' }}>Username</p>
            <TextField
              label="Enter your username"
              sx={{
                borderRadius: '8px',
                '& label': { fontFamily: 'Poppins', fontWeight: 'lighter', fontSize: '13px', textAlign: 'center' },
              }}
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
            <p style={{ marginTop: '20px', marginBottom: '7px' }}>Password</p>
            <TextField
              type={showPassword ? 'text' : 'password'}
              label="Password"
              sx={{
                '& label': { fontFamily: 'Poppins', fontWeight: 'lighter', fontSize: '13px', textAlign: 'center' },
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={true}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
            <p style={{ marginTop: '20px', marginBottom: '7px' }}>Confirm Password</p>
            <TextField
              type={showConPassword ? 'text' : 'password'}
              label="Confirm your Password"
              sx={{
                '& label': { fontFamily: 'Poppins', fontWeight: 'lighter', fontSize: '13px', textAlign: 'center' },
              }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required={true}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowConPassword}
                      edge="end"
                    >
                      {showConPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
            <div className="input-field button">
              <input type="submit" value="Signup" />
            </div>
          </form>
        </div>
        <Snackbar open={passwordError} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            Passwords don't match
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </div>
  );
};

export default Signup;
