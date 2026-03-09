import React, { useState } from "react";
import "./demo_credentials_modal.scss";

const DemoCredentialsModal = ({ isOpen, onClose }) => {
  const demoCredentials = {
    username: "john",
    password: "John123!",
  };

  const [copied, setCopied] = useState(null);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🔑 Demo Credentials</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <p className="info-text">Use these credentials to test the application:</p>

          <div className="credential-item">
            <label>Username:</label>
            <div className="credential-field">
              <input 
                type="text" 
                value={demoCredentials.username} 
                readOnly 
              />
              <button
                type="button"
                className={`copy-btn ${copied === 'username' ? 'copied' : ''}`}
                onClick={() => handleCopy(demoCredentials.username, 'username')}
              >
                {copied === 'username' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="credential-item">
            <label>Password:</label>
            <div className="credential-field">
              <input 
                type="text" 
                value={demoCredentials.password} 
                readOnly 
              />
              <button
                type="button"
                className={`copy-btn ${copied === 'password' ? 'copied' : ''}`}
                onClick={() => handleCopy(demoCredentials.password, 'password')}
              >
                {copied === 'password' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="info-box">
            <p>✨ This is a demo account for testing the application features.</p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-close" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default DemoCredentialsModal;
