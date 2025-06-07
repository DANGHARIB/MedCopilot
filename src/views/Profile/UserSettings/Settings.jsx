import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Save, 
  Bell, 
  Lock, 
  Globe, 
  Mail, 
  Smartphone, 
  Moon, 
  CheckCircle, 
  Home, 
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import './Settings.css';

const Settings = () => {
  // États pour les différentes sections de paramètres
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    applicationUpdates: true,
    newFeatures: true,
    marketingEmails: false,
    smsNotifications: false
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    shareActivity: true,
    allowDataCollection: true
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    fontSize: 'medium',
    highContrast: false
  });

  const [accountSettings, setAccountSettings] = useState({
    language: 'english',
    timezone: 'America/New_York'
  });

  // État pour les messages de succès/erreur
  const [saveStatus, setSaveStatus] = useState({
    show: false,
    type: 'success',
    message: ''
  });

  // Gestionnaires d'événements pour les changements de paramètres
  const handleNotificationChange = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    });
  };

  const handlePrivacyChange = (setting, value) => {
    setPrivacySettings({
      ...privacySettings,
      [setting]: typeof value === 'boolean' ? value : value
    });
  };

  const handleAppearanceChange = (setting, value) => {
    setAppearanceSettings({
      ...appearanceSettings,
      [setting]: value
    });
  };

  const handleAccountChange = (setting, value) => {
    setAccountSettings({
      ...accountSettings,
      [setting]: value
    });
  };

  // Fonction pour sauvegarder les paramètres
  const handleSaveSettings = () => {
    // Simuler une sauvegarde API
    setTimeout(() => {
      setSaveStatus({
        show: true,
        type: 'success',
        message: 'Your settings have been saved successfully.'
      });

      // Masquer le message après 3 secondes
      setTimeout(() => {
        setSaveStatus({ ...saveStatus, show: false });
      }, 3000);
    }, 600);
  };

  return (
    <div className="settings-container">
      <div className="settings-breadcrumb">
        <Link to="/profile" className="settings-breadcrumb-link">
          <Home size={16} className="settings-breadcrumb-icon" />
          Profile
        </Link>
        <span className="settings-breadcrumb-separator">
          <ChevronRight size={14} />
        </span>
        <span className="settings-breadcrumb-current">Settings</span>
      </div>

      <div className="settings-header">
        <h1 className="settings-title">Account Settings</h1>
        <p className="settings-description">
          Manage your account settings and preferences
        </p>
      </div>

      {saveStatus.show && (
        <div className={`settings-alert settings-alert-${saveStatus.type}`}>
          {saveStatus.type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertTriangle size={20} />
          )}
          <span>{saveStatus.message}</span>
        </div>
      )}

      <div className="settings-content">
        <div className="settings-sidebar">
          <nav className="settings-nav">
            <a href="#notifications" className="settings-nav-item">
              <Bell size={18} />
              <span>Notifications</span>
            </a>
            <a href="#privacy" className="settings-nav-item">
              <Lock size={18} />
              <span>Privacy</span>
            </a>
            <a href="#appearance" className="settings-nav-item">
              <Moon size={18} />
              <span>Appearance</span>
            </a>
            <a href="#account" className="settings-nav-item">
              <Globe size={18} />
              <span>Account Preferences</span>
            </a>
          </nav>
        </div>

        <div className="settings-main">
          {/* Notifications Section */}
          <section id="notifications" className="settings-section">
            <div className="settings-section-header">
              <Bell size={22} />
              <h2>Notifications</h2>
            </div>

            <div className="settings-option-group">
              <div className="settings-option">
                <div className="settings-option-info">
                  <h3>Email Notifications</h3>
                  <p>Receive email notifications for important updates</p>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailNotifications}
                    onChange={() => handleNotificationChange('emailNotifications')}
                  />
                  <span className="settings-toggle-slider"></span>
                </label>
              </div>

              <div className="settings-option">
                <div className="settings-option-info">
                  <h3>Application Updates</h3>
                  <p>Notifications about your application status changes</p>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={notificationSettings.applicationUpdates}
                    onChange={() => handleNotificationChange('applicationUpdates')}
                  />
                  <span className="settings-toggle-slider"></span>
                </label>
              </div>

              <div className="settings-option">
                <div className="settings-option-info">
                  <h3>New Features</h3>
                  <p>Be the first to know about new features and improvements</p>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={notificationSettings.newFeatures}
                    onChange={() => handleNotificationChange('newFeatures')}
                  />
                  <span className="settings-toggle-slider"></span>
                </label>
              </div>

              <div className="settings-option">
                <div className="settings-option-info">
                  <h3>Marketing Emails</h3>
                  <p>Receive promotional content and special offers</p>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={notificationSettings.marketingEmails}
                    onChange={() => handleNotificationChange('marketingEmails')}
                  />
                  <span className="settings-toggle-slider"></span>
                </label>
              </div>

              <div className="settings-option">
                <div className="settings-option-info">
                  <h3>SMS Notifications</h3>
                  <p>Receive text messages for critical updates</p>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={notificationSettings.smsNotifications}
                    onChange={() => handleNotificationChange('smsNotifications')}
                  />
                  <span className="settings-toggle-slider"></span>
                </label>
              </div>
            </div>
          </section>

          {/* Privacy Section */}
          <section id="privacy" className="settings-section">
            <div className="settings-section-header">
              <Lock size={22} />
              <h2>Privacy</h2>
            </div>

            <div className="settings-option-group">
              <div className="settings-option">
                <div className="settings-option-info">
                  <h3>Profile Visibility</h3>
                  <p>Control who can see your profile information</p>
                </div>
                <select
                  className="settings-select"
                  value={privacySettings.profileVisibility}
                  onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="contacts">Contacts Only</option>
                </select>
              </div>

              <div className="settings-option">
                <div className="settings-option-info">
                  <h3>Activity Sharing</h3>
                  <p>Share your application progress with other users</p>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={privacySettings.shareActivity}
                    onChange={() => handlePrivacyChange('shareActivity', !privacySettings.shareActivity)}
                  />
                  <span className="settings-toggle-slider"></span>
                </label>
              </div>

              <div className="settings-option">
                <div className="settings-option-info">
                  <h3>Data Collection</h3>
                  <p>Allow us to collect usage data to improve our services</p>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={privacySettings.allowDataCollection}
                    onChange={() => handlePrivacyChange('allowDataCollection', !privacySettings.allowDataCollection)}
                  />
                  <span className="settings-toggle-slider"></span>
                </label>
              </div>
            </div>
          </section>

          {/* Appearance Section */}
          <section id="appearance" className="settings-section">
            <div className="settings-section-header">
              <Moon size={22} />
              <h2>Appearance</h2>
            </div>

            <div className="settings-option-group">
              <div className="settings-option">
                <div className="settings-option-info">
                  <h3>Theme</h3>
                  <p>Choose your preferred color theme</p>
                </div>
                <div className="settings-theme-selector">
                  <label className={`settings-theme-option ${appearanceSettings.theme === 'light' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      checked={appearanceSettings.theme === 'light'}
                      onChange={() => handleAppearanceChange('theme', 'light')}
                    />
                    <span className="settings-theme-light">Light</span>
                  </label>
                  <label className={`settings-theme-option ${appearanceSettings.theme === 'dark' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      checked={appearanceSettings.theme === 'dark'}
                      onChange={() => handleAppearanceChange('theme', 'dark')}
                    />
                    <span className="settings-theme-dark">Dark</span>
                  </label>
                  <label className={`settings-theme-option ${appearanceSettings.theme === 'system' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="theme"
                      value="system"
                      checked={appearanceSettings.theme === 'system'}
                      onChange={() => handleAppearanceChange('theme', 'system')}
                    />
                    <span className="settings-theme-system">System</span>
                  </label>
                </div>
              </div>

              <div className="settings-option">
                <div className="settings-option-info">
                  <h3>Font Size</h3>
                  <p>Adjust the text size for better readability</p>
                </div>
                <select
                  className="settings-select"
                  value={appearanceSettings.fontSize}
                  onChange={(e) => handleAppearanceChange('fontSize', e.target.value)}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <div className="settings-option">
                <div className="settings-option-info">
                  <h3>High Contrast</h3>
                  <p>Increase contrast for better accessibility</p>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={appearanceSettings.highContrast}
                    onChange={() => handleAppearanceChange('highContrast', !appearanceSettings.highContrast)}
                  />
                  <span className="settings-toggle-slider"></span>
                </label>
              </div>
            </div>
          </section>

          {/* Account Preferences Section */}
          <section id="account" className="settings-section">
            <div className="settings-section-header">
              <Globe size={22} />
              <h2>Account Preferences</h2>
            </div>

            <div className="settings-option-group">
              <div className="settings-option">
                <div className="settings-option-info">
                  <h3>Language</h3>
                  <p>Select your preferred language</p>
                </div>
                <select
                  className="settings-select"
                  value={accountSettings.language}
                  onChange={(e) => handleAccountChange('language', e.target.value)}
                >
                  <option value="english">English</option>
                  <option value="french">French</option>
                  <option value="spanish">Spanish</option>
                  <option value="german">German</option>
                </select>
              </div>

              <div className="settings-option">
                <div className="settings-option-info">
                  <h3>Time Zone</h3>
                  <p>Set your local time zone for accurate deadlines</p>
                </div>
                <select
                  className="settings-select"
                  value={accountSettings.timezone}
                  onChange={(e) => handleAccountChange('timezone', e.target.value)}
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                  <option value="Europe/Paris">Central European Time (CET)</option>
                </select>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="settings-actions">
        <button className="settings-save-button" onClick={handleSaveSettings}>
          <Save size={18} />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;