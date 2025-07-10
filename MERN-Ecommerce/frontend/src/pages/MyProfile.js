import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";
import SummaryApi from "../common/index";
import { FaUserCircle, FaCamera, FaEdit, FaSave, FaTimes, FaPhone, FaEnvelope, FaUser, FaUpload } from "react-icons/fa";

const MyProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userDetails);
  const [profilePicURL, setProfilePicURL] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const backendURL = 'http://localhost:8080';

  useEffect(() => {
    if (user?.profilePicture) {
      const filename = user.profilePicture.split('\\').pop();
      setProfilePicURL(`${backendURL}/uploads/${filename}`);
    } else {
      setProfilePicURL("");
    }
    setEditedUser(user || {});
  }, [user]);

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('profilePic', file);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch(SummaryApi.updateProfilePicture(user._id).url, {
        method: SummaryApi.updateProfilePicture(user._id).method,
        credentials: "include",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = await response.json();
      if (data.success) {
        const filename = data.profilePicture.split('\\').pop();
        const newProfilePicURL = `${backendURL}/uploads/${filename}`;
        setProfilePicURL(newProfilePicURL);
        dispatch(setUserDetails({ ...user, profilePicture: data.profilePicture }));
        
        // Success animation
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
        }, 1000);
      } else {
        console.error("Failed to update profile picture:", data.message);
        setIsUploading(false);
        setUploadProgress(0);
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
      setIsUploading(false);
      setUploadProgress(0);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedUser({ ...user });
  };

  const handleSave = async () => {
    // Here you would typically make an API call to update user details
    dispatch(setUserDetails(editedUser));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser({ ...user });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedUser(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Main Profile Card */}
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100 transform transition-all duration-300 hover:shadow-3xl">
          {/* Header with gradient background */}
          <div className="relative h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              {/* Profile Picture Section */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-white overflow-hidden transition-all duration-300 group-hover:scale-105">
                  {profilePicURL ? (
                    <img
                      src={profilePicURL}
                      alt="Profile"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <FaUserCircle className="w-20 h-20 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Upload overlay */}
                {isUploading && (
                  <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <span className="text-white text-xs">{uploadProgress}%</span>
                    </div>
                  </div>
                )}

                {/* Camera button */}
                <label className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-full cursor-pointer shadow-lg transform transition-all duration-200 hover:scale-110 hover:shadow-xl group-hover:opacity-100 opacity-80">
                  <FaCamera size={14} />
                  <input
                    type="file"
                    onChange={handleProfilePicChange}
                    className="hidden"
                    ref={fileInputRef}
                    accept="image/*"
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 pb-8 px-8">
            {/* Name Section */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {user?.name || "User Name"}
              </h1>
              <p className="text-gray-600 mb-4">Welcome to your profile</p>
              
              {/* Edit/Save buttons */}
              <div className="flex justify-center space-x-4">
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 flex items-center space-x-2"
                  >
                    <FaEdit size={14} />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSave}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 flex items-center space-x-2"
                    >
                      <FaSave size={14} />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 flex items-center space-x-2"
                    >
                      <FaTimes size={14} />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Details Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Information Card */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FaUser className="mr-3 text-blue-600" />
                  Personal Information
                </h3>
                
                <div className="space-y-4">
                  {/* Name Field */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.name || ""}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200 group-hover:shadow-md transition-all duration-200">
                        <span className="text-gray-800 font-medium">{user?.name || "Not specified"}</span>
                      </div>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div className="group">
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <FaPhone className="mr-2 text-green-600" size={12} />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedUser.phoneNumber || ""}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200 group-hover:shadow-md transition-all duration-200">
                        <span className="text-gray-800 font-medium">{user?.phoneNumber || "Not specified"}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information Card */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FaEnvelope className="mr-3 text-green-600" />
                  Contact Information
                </h3>
                
                <div className="space-y-4">
                  {/* Email Field */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200 group-hover:shadow-md transition-all duration-200">
                      <span className="text-gray-800 font-medium">{user?.email || "Not specified"}</span>
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified</span>
                    </div>
                  </div>

                  {/* Member Since */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                    <div className="px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200 group-hover:shadow-md transition-all duration-200">
                      <span className="text-gray-800 font-medium">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : "Recently joined"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-100 transform transition-all duration-300 hover:scale-105">
                <div className="text-2xl font-bold text-orange-600">12</div>
                <div className="text-sm text-gray-600">Orders</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 transform transition-all duration-300 hover:scale-105">
                <div className="text-2xl font-bold text-purple-600">5</div>
                <div className="text-sm text-gray-600">Reviews</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-100 transform transition-all duration-300 hover:scale-105">
                <div className="text-2xl font-bold text-green-600">★ 4.8</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Actions */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 transform transition-all duration-300 hover:scale-105">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-200 text-blue-700 font-medium">
                Change Password
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl bg-green-50 hover:bg-green-100 transition-all duration-200 text-green-700 font-medium">
                Privacy Settings
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl bg-purple-50 hover:bg-purple-100 transition-all duration-200 text-purple-700 font-medium">
                Notification Preferences
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 transform transition-all duration-300 hover:scale-105">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Account Status</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Email Verified</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Yes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Profile Complete</span>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">85%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;