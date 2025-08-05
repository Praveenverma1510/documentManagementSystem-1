import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/LoginPage.css';

const LoginPage = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const validateMobile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const pattern = /^[6-9]\d{9}$/;
    if (!pattern.test(mobileNumber)) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post(
        'https://apis.allsoft.co/api/documentManagement/generateOTP', 
        { mobile_number: mobileNumber }
      );
      
      if (response.data.status) {
        setShowOtpField(true);
        setSuccess(`OTP sent to ${mobileNumber}`);
      } else {
        setError(response.data.message || 'Failed to send OTP');
      }
    } catch (err) {
      console.error('OTP generation failed:', err);
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateOtp = async (e) => {
    e.preventDefault();
    setError('');
    
    const pattern = /^\d{6}$/;
    if (!pattern.test(otp)) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post(
        'https://apis.allsoft.co/api/documentManagement/validateOTP',
        {
          mobile_number: mobileNumber,
          otp: otp
        }
      );
      
      if (response.data.status) {
        localStorage.setItem('token', response.data.data.token);
        setSuccess('OTP verified successfully!');
        navigate('/upload');
      } else {
        setError(response.data.message || 'Invalid OTP');
      }
    } catch (err) {
      console.error('OTP validation failed:', err);
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToMobile = () => {
    setShowOtpField(false);
    setOtp('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Please {showOtpField ? 'verify your OTP' : 'enter your mobile number'} to continue</p>
        </div>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!showOtpField ? (
          <form onSubmit={validateMobile}>
            <div className="mb-3">
              <label htmlFor="mobileNumber" className="form-label">Mobile Number</label>
              <div className="input-group">
                <span className="input-group-text">+91</span>
                <input
                  type="tel"
                  className="form-control"
                  id="mobileNumber"
                  placeholder="Enter 10-digit mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  maxLength="10"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Sending OTP...
                </>
              ) : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={validateOtp}>
            <div className="mb-3">
              <label htmlFor="otp" className="form-label">Enter OTP</label>
              <input
                type="text"
                className="form-control"
                id="otp"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength="6"
                required
              />
              <div className="form-text">
                Didn't receive OTP? <button type="button" className="btn btn-link p-0" onClick={validateMobile}>Resend</button>
              </div>
            </div>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary flex-grow-1"
                onClick={handleBackToMobile}
                disabled={isLoading}
              >
                Back
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-grow-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Verifying...
                  </>
                ) : 'Verify OTP'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;