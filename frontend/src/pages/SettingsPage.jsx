import React, { useState } from 'react'
import { useAuth } from '../utils/useAuth.jsx'
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Globe, 
  Download, 
  Trash2,
  Save,
  Eye,
  EyeOff
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '../utils/api'
import EditProfileModal from '../components/profile/EditProfileModal'

const SettingsPage = () => {
  const { user, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false,
    comments: true,
    likes: true,
    followers: true
  })
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    allowComments: true,
    allowMessages: true,
    showOnlineStatus: true
  })
  const [theme, setTheme] = useState('light')

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'data', label: 'Data & Export', icon: Download }
  ]

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    try {
      // Validate passwords
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error('New passwords do not match')
        return
      }
      
      if (passwordData.newPassword.length < 6) {
        toast.error('New password must be at least 6 characters long')
        return
      }
      
      const response = await api.put('/auth/updatepassword', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      
      // Store the new token if returned
      if (response.data && response.data.token) {
        localStorage.setItem('authToken', response.data.token)
      }
      
      toast.success('Password updated successfully')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      console.error('Error updating password:', error)
      const errorMessage = error.response?.data?.message || 'An error occurred while updating your password'
      toast.error(errorMessage)
    }
  }

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handlePrivacyChange = (key, value) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    // TODO: Implement theme change
  }

  const exportData = () => {
    // TODO: Implement data export
    console.log('Exporting data...')
  }

  const deleteAccount = () => {
    // TODO: Implement account deletion
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Deleting account...')
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                <p className="text-gray-600">Manage your personal information and profile settings</p>
              </div>
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Edit Profile
              </button>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={user?.avatar || '/placeholder-user.jpg'}
                  alt={user?.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{user?.name}</h4>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Bio:</span>
                  <p className="text-gray-900">{user?.bio || 'No bio added yet'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Location:</span>
                  <p className="text-gray-900">{user?.location || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Website:</span>
                  <p className="text-gray-900">{user?.website || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Member since:</span>
                  <p className="text-gray-900">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
              <p className="text-gray-600">Manage your password and account security</p>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Change Password</h4>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Update Password
                </button>
              </form>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
              <p className="text-gray-600">Choose how and when you want to be notified</p>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 capitalize">{key}</h4>
                      <p className="text-sm text-gray-500">
                        {key === 'email' && 'Receive notifications via email'}
                        {key === 'push' && 'Receive push notifications in your browser'}
                        {key === 'marketing' && 'Receive marketing and promotional emails'}
                        {key === 'comments' && 'Get notified when someone comments on your posts'}
                        {key === 'likes' && 'Get notified when someone likes your posts'}
                        {key === 'followers' && 'Get notified when someone follows you'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange(key)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        value ? 'bg-yellow-600' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        value ? 'transform translate-x-6' : 'transform translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'privacy':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Privacy Settings</h3>
              <p className="text-gray-600">Control who can see your information and content</p>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
                  <select
                    value={privacy.profileVisibility}
                    onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="public">Public - Anyone can see your profile</option>
                    <option value="followers">Followers Only - Only your followers can see your profile</option>
                    <option value="private">Private - Only you can see your profile</option>
                  </select>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Show Email Address</h4>
                      <p className="text-sm text-gray-500">Allow others to see your email address</p>
                    </div>
                    <button
                      onClick={() => handlePrivacyChange('showEmail', !privacy.showEmail)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        privacy.showEmail ? 'bg-yellow-600' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        privacy.showEmail ? 'transform translate-x-6' : 'transform translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Allow Comments</h4>
                      <p className="text-sm text-gray-500">Allow others to comment on your posts</p>
                    </div>
                    <button
                      onClick={() => handlePrivacyChange('allowComments', !privacy.allowComments)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        privacy.allowComments ? 'bg-yellow-600' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        privacy.allowComments ? 'transform translate-x-6' : 'transform translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Allow Messages</h4>
                      <p className="text-sm text-gray-500">Allow others to send you direct messages</p>
                    </div>
                    <button
                      onClick={() => handlePrivacyChange('allowMessages', !privacy.allowMessages)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        privacy.allowMessages ? 'bg-yellow-600' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        privacy.allowMessages ? 'transform translate-x-6' : 'transform translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Appearance Settings</h3>
              <p className="text-gray-600">Customize how BlogsInk looks and feels</p>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Theme</label>
                <div className="grid grid-cols-3 gap-4">
                  {['light', 'dark', 'auto'].map((themeOption) => (
                    <button
                      key={themeOption}
                      onClick={() => handleThemeChange(themeOption)}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        theme === themeOption
                          ? 'border-yellow-500 bg-yellow-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className={`w-8 h-8 rounded mx-auto mb-2 ${
                          themeOption === 'light' ? 'bg-gray-200' :
                          themeOption === 'dark' ? 'bg-gray-800' :
                          'bg-gradient-to-r from-gray-200 to-gray-800'
                        }`} />
                        <span className="text-sm font-medium capitalize">{themeOption}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 'data':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Data & Export</h3>
              <p className="text-gray-600">Manage your data and export options</p>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Export Your Data</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Download a copy of all your data, including posts, comments, and profile information
                  </p>
                  <button
                    onClick={exportData}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Export Data
                  </button>
                </div>
                
                <hr />
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Delete Account</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <button
                    onClick={deleteAccount}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and settings</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-yellow-100 text-yellow-700 border-r-2 border-yellow-500'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  )
                })}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onProfileUpdate={updateUser}
      />
    </div>
  )
}

export default SettingsPage
