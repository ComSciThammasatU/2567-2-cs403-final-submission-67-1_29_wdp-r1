import React, { useState } from 'react';
import './Login.css';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import TextField from '@mui/material/TextField';
import { Checkbox, FormControlLabel, Hidden, Snackbar, Alert } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import cam from './image/image.png';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { orange } from '@mui/material/colors';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const theme = createTheme({
    typography: {
      fontFamily: ["Poppins"].join(","),
    },
    palette: {
      secondary: {
        main: orange[500],
      },
    },
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');

    if (email === storedEmail && password === storedPassword) {
      setLoginError(false);
      navigate('/Mainpage');
    } else {
      setLoginError(true);
    }
  };

  const handleCloseSnackbar = () => {
    setLoginError(false);
  };

  return (
    <div className="bodyLogin">
      <ThemeProvider theme={theme}>
        <Hidden smDown>
          <div className="context">
            <header>Log in to</header>
            <h1>ALL-D</h1>
            <p>Affordable Life Logging Device</p>
            <text style={{ marginTop: '2em' }}>If you don’t have an account</text>
            <text> you can
              <Link to="/signup" style={{ color: '#FFB545', textDecoration: 'none' }}> Register here!</Link>
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
                '& label': { 'fontFamily': 'Poppins', 'fontWeight': 'lighter', 'fontSize': '13px', 'textAlign': 'center', }
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p style={{ marginTop: '20px', marginBottom: '7px' }}>Password</p>
            <TextField
              type={showPassword ? "text" : "password"}
              label="Password"
              sx={{
                '& label': { 'fontFamily': 'Poppins', 'fontWeight': 'lighter', 'fontSize': '13px', 'textAlign': 'center', }
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
            <div className="textright">
              <FormControlLabel
                label="Remember me"
                control={
                  <Checkbox
                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                    name="checkedI"
                    sx={{
                      color: orange[800],
                      '&.Mui-checked': {
                        color: orange[600],
                      },
                      '& .MuiSvgIcon-root': { fontSize: 20 },
                      '& .MuiFormControlLabel-label': { fontSize: 5 }
                    }}
                  />
                }
              />
              <text>Forgot Password?</text>
            </div>
            <div className="input-field button">
              <input type="submit" value="Login" />
            </div>
          </form>
        </div>
        <Snackbar open={loginError} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            Email or password don't match
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </div>
  );
};

export default Login;
