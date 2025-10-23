"use client"

import React, { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff, Smartphone, Key, Clock, Save, AlertTriangle, X } from 'lucide-react';

const AccountSettings = ({ onClose, embedded = false }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('60');
  const [isDirty, setIsDirty] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  const [passwordMatch, setPasswordMatch] = useState({
    isValid: true,
    showError: false
  });

  const [notification, setNotification] = useState({
    show: false,
    type: '',
    message: ''
  });

  const [confirmModal, setConfirmModal] = useState({
    show: false,
    title: '',
    message: '',
    onConfirm: null
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));

    if (field === 'newPassword') {
      validatePassword(value);
      if (passwordData.confirmPassword) {
        validatePasswordMatch(value, passwordData.confirmPassword);
      }
    }

    if (field === 'confirmPassword') {
      validatePasswordMatch(passwordData.newPassword, value);
    }
    
    setIsDirty(true);
  };

  const validatePassword = (password) => {
    const validation = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };

    setPasswordValidation(validation);
    return Object.values(validation).every(Boolean);
  };

  const validatePasswordMatch = (newPassword, confirmPassword) => {
    const isMatching = newPassword === confirmPassword;
    const shouldShowError = confirmPassword.length > 0 && !isMatching;
    
    setPasswordMatch({
      isValid: isMatching,
      showError: shouldShowError
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 4000);
  };


  const showConfirmation = (title, message, onConfirm) => {
    setConfirmModal({ show: true, title, message, onConfirm });
  };

  const handleConfirmAction = () => {
    if (confirmModal.onConfirm) {
      confirmModal.onConfirm();
    }
    setConfirmModal({ show: false, title: '', message: '', onConfirm: null });
  };

  const handleCancelAction = () => {
    setConfirmModal({ show: false, title: '', message: '', onConfirm: null });
  };

  const handleSave = () => {
    console.log('Saving account settings...');
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification('error', 'New passwords do not match!');
      return;
    }

    if (passwordData.newPassword && !validatePassword(passwordData.newPassword)) {
      showNotification('error', 'New password does not meet all requirements!');
      return;
    }

    if ((passwordData.newPassword || passwordData.confirmPassword) && !passwordData.currentPassword) {
      showNotification('error', 'Current password is required to change password!');
      return;
    }
    
    setIsDirty(false);
    showNotification('success', 'Settings saved successfully!');
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleEnable2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    setIsDirty(true);
    console.log('2FA toggled:', !twoFactorEnabled);
  };

  const lastLoginSessions = [
    {
      id: 1,
      device: 'Chrome on Windows',
      location: 'Johannesburg, South Africa',
      time: '2 hours ago',
      current: true
    },
    {
      id: 2,
      device: 'Safari on iPhone',
      location: 'Cape Town, South Africa',
      time: '1 day ago',
      current: false
    },
    {
      id: 3,
      device: 'Firefox on macOS',
      location: 'Durban, South Africa',
      time: '3 days ago',
      current: false
    }
  ];

  return (
    <>
      {/* Backdrop */}
      {!embedded && (
        <div 
          className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
            isVisible ? 'opacity-50' : 'opacity-0'
          }`}
          onClick={handleClose}
        />
      )}
      
      {/* Confirmation Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 flex items-center justify-center z-60 px-4">
          <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-2xl border-2 border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle size={18} className="text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-800">{confirmModal.title}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">{confirmModal.message}</p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={handleCancelAction}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Notification Modal */}
      {notification.show && (
        <div className="fixed inset-0 flex items-center justify-center z-60 px-4">
          <div className={`max-w-md w-full p-6 rounded-lg shadow-2xl transform transition-all duration-300 ${
            notification.type === 'success' 
              ? 'bg-green-50 border-2 border-green-200' 
              : 'bg-red-50 border-2 border-red-200'
          }`}>
            <div className="flex items-center space-x-3">
              {notification.type === 'success' ? (
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                  <span className="text-white text-lg">✓</span>
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                  <AlertTriangle size={18} className="text-white" />
                </div>
              )}
              <div>
                <h3 className={`font-semibold ${
                  notification.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {notification.type === 'success' ? 'Success' : 'Error'}
                </h3>
                <p className={`text-sm ${
                  notification.type === 'success' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {notification.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Slide Panel */}
      <div className={embedded 
        ? "w-full h-full bg-white" 
        : `fixed top-0 right-0 h-full w-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
            isVisible ? 'translate-x-0' : 'translate-x-full'
          }`}>
        
        {/* Scrollable Content */}
        <div className="h-full overflow-y-auto">
          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-8 sticky top-0 bg-white pb-4 border-b border-gray-100">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-3">Account Settings</h1>
                <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                  Manage your account security, password, and authentication settings.
                </p>
              </div>

              {/* Close Button */}
              {!embedded && (
              <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-shrink-0"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              )}
            </div>

            {/* Save Button */}
            {isDirty && (
              <div className="flex justify-end mb-6 sticky top-20 bg-white py-4 border-b border-gray-100">
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors duration-200"
                >
                  <Save size={16} />
                  <span>Save Changes</span>
                </button>
              </div>
            )}

            <div className="space-y-8">
              {/* Password Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Key className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
                    <p className="text-sm text-gray-600">Update your account password</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                        className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:border-green-700 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-200"
                        placeholder="Enter your current password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                          className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:border-green-700 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-200"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('new')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          value={passwordData.confirmPassword}
                          onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                          className={`w-full pl-4 pr-12 py-3 border rounded-lg focus:ring-4 outline-none transition-all duration-200 ${
                            passwordMatch.showError 
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                              : 'border-gray-300 focus:border-green-700 focus:ring-green-100'
                          }`}
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('confirm')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {/* Real-time password mismatch error */}
                      {passwordMatch.showError && (
                        <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-200">
                          <p className="text-sm text-red-700 flex items-center space-x-2">
                            <AlertTriangle size={14} className="text-red-600" />
                            <span>Passwords do not match</span>
                          </p>
                        </div>
                      )}
                      {/* Success indicator when passwords match */}
                      {passwordData.confirmPassword && !passwordMatch.showError && passwordData.confirmPassword.length > 0 && (
                        <div className="mt-2 p-2 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-sm text-green-700 flex items-center space-x-2">
                            <span className="w-3.5 h-3.5 rounded-full bg-green-600 text-white flex items-center justify-center text-xs">✓</span>
                            <span>Passwords match</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800 mb-2">Password Requirements:</p>
                    <ul className="text-xs space-y-1">
                      <li className={`flex items-center space-x-2 ${passwordValidation.minLength ? 'text-green-700' : 'text-blue-700'}`}>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                          passwordValidation.minLength ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                        }`}>
                          {passwordValidation.minLength ? '✓' : '•'}
                        </span>
                        <span>At least 8 characters long</span>
                      </li>
                      <li className={`flex items-center space-x-2 ${passwordValidation.hasUppercase ? 'text-green-700' : 'text-blue-700'}`}>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                          passwordValidation.hasUppercase ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                        }`}>
                          {passwordValidation.hasUppercase ? '✓' : '•'}
                        </span>
                        <span>Contains at least one uppercase letter</span>
                      </li>
                      <li className={`flex items-center space-x-2 ${passwordValidation.hasLowercase ? 'text-green-700' : 'text-blue-700'}`}>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                          passwordValidation.hasLowercase ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                        }`}>
                          {passwordValidation.hasLowercase ? '✓' : '•'}
                        </span>
                        <span>Contains at least one lowercase letter</span>
                      </li>
                      <li className={`flex items-center space-x-2 ${passwordValidation.hasNumber ? 'text-green-700' : 'text-blue-700'}`}>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                          passwordValidation.hasNumber ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                        }`}>
                          {passwordValidation.hasNumber ? '✓' : '•'}
                        </span>
                        <span>Contains at least one number</span>
                      </li>
                      <li className={`flex items-center space-x-2 ${passwordValidation.hasSpecialChar ? 'text-green-700' : 'text-blue-700'}`}>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                          passwordValidation.hasSpecialChar ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                        }`}>
                          {passwordValidation.hasSpecialChar ? '✓' : '•'}
                        </span>
                        <span>Contains at least one special character</span>
                      </li>
                    </ul>
                    
                    {/* Password strength indicator */}
                    {passwordData.newPassword && (
                      <div className="mt-3">
                        <p className="text-xs text-blue-800 mb-1">Password Strength:</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              Object.values(passwordValidation).filter(Boolean).length === 5 ? 'bg-green-500' :
                              Object.values(passwordValidation).filter(Boolean).length >= 3 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ 
                              width: `${(Object.values(passwordValidation).filter(Boolean).length / 5) * 100}%` 
                            }}
                          />
                        </div>
                        <p className={`text-xs mt-1 ${
                          Object.values(passwordValidation).filter(Boolean).length === 5 ? 'text-green-600' :
                          Object.values(passwordValidation).filter(Boolean).length >= 3 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {Object.values(passwordValidation).filter(Boolean).length === 5 ? 'Strong' :
                          Object.values(passwordValidation).filter(Boolean).length >= 3 ? 'Medium' :
                          'Weak'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Smartphone className="w-5 h-5 text-green-700" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h2>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`text-sm font-medium ${twoFactorEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                      {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <button
                      onClick={handleEnable2FA}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                        twoFactorEnabled ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {twoFactorEnabled ? (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <p className="text-sm font-medium text-green-800">Two-Factor Authentication is Active</p>
                    </div>
                    <p className="text-sm text-green-700">
                      Your account is protected with two-factor authentication using your email.
                    </p>
                    <button className="mt-3 text-sm text-green-700 hover:text-green-800 underline">
                      View Recovery Codes
                    </button>
                  </div>
                ) : (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <p className="text-sm font-medium text-yellow-800">Enhance Your Security</p>
                    </div>
                    <p className="text-sm text-yellow-700 mb-3">
                      Enable two-factor authentication to secure your account with an additional verification step.
                    </p>
                    <button
                      onClick={handleEnable2FA}
                      className="text-sm bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      Set Up 2FA
                    </button>
                  </div>
                )}
              </div>

              {/* Session Management */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Clock className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Session Management</h2>
                    <p className="text-sm text-gray-600">Control your login sessions and timeout settings</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <select
                      value={sessionTimeout}
                      onChange={(e) => {
                        setSessionTimeout(e.target.value);
                        setIsDirty(true);
                      }}
                      className="w-full md:w-64 px-4 py-3 border border-gray-300 rounded-lg focus:border-green-700 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-200"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                      <option value="240">4 hours</option>
                      <option value="480">8 hours</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      You will be automatically logged out after this period of inactivity.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Active Sessions</h3>
                    <div className="space-y-3">
                      {lastLoginSessions.map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${session.current ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{session.device}</p>
                              <p className="text-xs text-gray-600">{session.location} • {session.time}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {session.current && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                Current
                              </span>
                            )}
                            {!session.current && (
                              <button
                                onClick={() => console.log('Terminate session:', session.id)}
                                className="text-xs text-red-600 hover:text-red-800 px-3 py-1 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                              >
                                Terminate
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => console.log('Terminate all other sessions')}
                      className="mt-4 text-sm text-red-600 hover:text-red-800 underline"
                    >
                      Sign out all other sessions
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
                    <p className="text-sm text-red-600">Irreversible and destructive actions</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border border-red-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Delete Account</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <button
                      onClick={() => {
                        showConfirmation(
                          'Delete Account',
                          'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.',
                          () => {
                            console.log('Account deletion requested');
                            showNotification('success', 'Account deletion has been initiated.');
                          }
                        );
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountSettings;