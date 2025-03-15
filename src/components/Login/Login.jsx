import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Stepper, Step, StepLabel, Button, TextField } from '@mui/material';

const steps = ["Enter Email", "Enter Password"];

const LoginComponent = () => {
    const navigate = useNavigate();
    const signUpFormRef = useRef(null);

    const [activeLogin, setActiveLogin] = useState("operations");
    const [activeStep, setActiveStep] = useState(0);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleToggleClick = () => {
        const logincontainer = document.getElementById('logincontainer');
        logincontainer.classList.toggle('active');
        setActiveLogin(prev => prev === "operations" ? "advisor" : "operations");
        setActiveStep(0); // Reset to first step if toggling
        setEmail("");
        setPassword("");
    };

    const handleEmailSubmit = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/${activeLogin === "advisor" ? "advisory" : "operational-admin"}/send-password`,
                { email }
            );
            toast.success(response.data.message);
            setActiveStep(1); // Go to step 2
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
        setLoading(false);
    };

    const handlePasswordSubmit = async () => {
        setLoading(true);
        try {
            const endpoint = `${process.env.REACT_APP_API_URL}/api/${activeLogin === "advisor" ? "advisory" : "operational-admin"}/login`;
            await axios.post(endpoint, { email, password }, { withCredentials: true });
            toast.success("Login successful!");
            navigate(activeLogin === "advisor" ? "/advisory-dashboard" : "/operational-admin-dashboard");
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
        setLoading(false);
    };
    return (
        <div className='body d-flex justify-content-center align-items-center vh-100'>
            <div className="logincontainer" id="logincontainer">
                <div className={`form-logincontainer sign-up ${activeLogin === 'operations' ? 'active' : ''} mb-4`}>
                    <form ref={signUpFormRef} className="d-flex flex-column align-items-center">
                        <h2 className="text-center">Advisor Sign In</h2>
                        <span className="text-center">Use your email to get the password</span>
                        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                            {steps.map((label, index) => (
                                <Step key={index}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        
                        {/* Show email input only if on step 0 */}
                        {activeStep === 0 && (
                            <>
                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    fullWidth
                                    className="mb-2"
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleEmailSubmit}
                                    disabled={loading}
                                    sx={{
                                        mt: 2,
                                        backgroundColor: '#6C584C', // Dark Brown
                                        color: '#F0EAD2',           // Light Cream
                                        '&:hover': { backgroundColor: '#A98467' } // Tan
                                    }}
                                >
                                    {loading ? "Sending..." : "Send Password"}
                                </Button>
                            </>
                        )}
                        
                        {/* Show password input only if on step 1 */}
                        {activeStep === 1 && (
                            <>
                                <TextField
                                    label="Password"
                                    variant="outlined"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    fullWidth
                                    className="mb-2"
                                />
                                <Button
                                    variant="contained"
                                    onClick={handlePasswordSubmit}
                                    disabled={loading}
                                    sx={{
                                        mt: 2,
                                        backgroundColor: '#6C584C', // Dark Brown
                                        color: '#F0EAD2',           // Light Cream
                                        '&:hover': { backgroundColor: '#A98467' } // Tan
                                    }}
                                >
                                    {loading ? "Logging in..." : "Login"}
                                </Button>
                            </>
                        )}
                    </form>
                </div>

                <div className={`form-logincontainer sign-in ${activeLogin === 'advisor' ? 'active' : ''} mb-4`}>
                    <form className="d-flex flex-column align-items-center">
                        <h2 className="text-center">Operations Sign In</h2>
                        <span className="text-center">Use your email to get the password</span>
                        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                            {steps.map((label, index) => (
                                <Step key={index}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                        {/* Show email input only if on step 0 */}
                        {activeStep === 0 && (
                            <>
                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    fullWidth
                                    className="mb-2"
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleEmailSubmit}
                                    disabled={loading}
                                    sx={{
                                        mt: 2,
                                        backgroundColor: '#6C584C', // Dark Brown
                                        color: '#F0EAD2',           // Light Cream
                                        '&:hover': { backgroundColor: '#A98467' } // Tan
                                    }}
                                >
                                    {loading ? "Sending..." : "Send Password"}
                                </Button>
                            </>
                        )}
                        
                        {/* Show password input only if on step 1 */}
                        {activeStep === 1 && (
                            <>
                                <TextField
                                    label="Password"
                                    variant="outlined"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    fullWidth
                                    className="mb-2"
                                />
                                <Button
                                    variant="contained"
                                    onClick={handlePasswordSubmit}
                                    disabled={loading}
                                    sx={{
                                        mt: 2,
                                        backgroundColor: '#6C584C', // Dark Brown
                                        color: '#F0EAD2',           // Light Cream
                                        '&:hover': { backgroundColor: '#A98467' } // Tan
                                    }}
                                >
                                    {loading ? "Logging in..." : "Login"}
                                </Button>
                            </>
                        )}
                    </form>
                </div>

                <div className="toggle-logincontainer text-center">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h2 style={{ color: '#F0EAD2' }}>Hello, Operations!</h2>
                            <p style={{ color: '#F0EAD2' }}>Are you from Operations? Click on the Operations Button to Sign in</p>
                            <button className="hidden" onClick={handleToggleClick}>Operations</button>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h2 style={{ color: '#F0EAD2' }}>Hello, Advisor!</h2>
                            <p style={{ color: '#F0EAD2' }}>Are you from Advisor? Click on the Advisor Button to Sign in</p>
                            <button className="hidden" onClick={handleToggleClick}>Advisor</button>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default LoginComponent;