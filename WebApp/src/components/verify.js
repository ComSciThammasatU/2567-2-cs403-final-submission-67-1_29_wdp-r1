import React, { useState } from 'react';
import './verify.css';
import TextField from '@mui/material/TextField';
import { NavLink } from 'react-router-dom';

const Verify = () => {
    const [verificationCode, setVerificationCode] = useState('');
    const email = localStorage.getItem('email');

    return (
        <div className="bodyVerify">
            <div className="containerVerify">
                <header>Verify your email</header>
                <form >
                    <p>We have sent a verification code to <strong>{email}</strong></p>
                    <p>Please enter it below</p>
                    <TextField
                        label="Enter your code"
                        sx={{
                            borderRadius: '8px',
                            '& label': { 'fontFamily': 'Poppins', 'fontWeight': 'lighter', 'fontSize': '13px', 'textAlign': 'center', }
                        }}
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        required
                    />
                    <NavLink to="/Mainpage">
                        <div className="input-field button">
                            <input type="submit" value="Verify" />
                        </div>
                    </NavLink>
                </form>
            </div>
        </div>
    );
};

export default Verify;
