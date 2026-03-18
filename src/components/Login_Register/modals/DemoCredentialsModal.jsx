import React, { useState } from "react";
import "./demo_credentials_modal.scss";

const DemoCredentialsModal = ({ isOpen, onClose }) => {
  const demoAccounts = [
    { label: "Veterinarian", username: "john", password: "John123!" },
    { label: "Veterinarian", username: "jane", password: "Jane123!" },
    { label: "Helper", username: "marko", password: "Marko123!" },
  ];

  const [copied, setCopied] = useState(null);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
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

          {demoAccounts.map((account) => (
            <div key={account.label} className="account-block">
              <h3 className="account-label">{account.label}</h3>

              <div className="credential-item">
                <label>Username:</label>
                <div className="credential-field">
                  <input type="text" value={account.username} readOnly />
                  <button
                    type="button"
                    className={`copy-btn ${copied === `${account.label}-username` ? 'copied' : ''}`}
                    onClick={() => handleCopy(account.username, `${account.label}-username`)}
                  >
                    {copied === `${account.label}-username` ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="credential-item">
                <label>Password:</label>
                <div className="credential-field">
                  <input type="text" value={account.password} readOnly />
                  <button
                    type="button"
                    className={`copy-btn ${copied === `${account.label}-password` ? 'copied' : ''}`}
                    onClick={() => handleCopy(account.password, `${account.label}-password`)}
                  >
                    {copied === `${account.label}-password` ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="info-box">
            <p>✨ These are demo accounts for testing the application features.</p>
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
