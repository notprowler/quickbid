import React, { useState } from "react";
import { FaUser } from "react-icons/fa";

interface UserData {
  name: string;
  email: string;
  username: string;
  profilePicture: string;
}

interface EditProfileProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserData;
  onUpdate: (updatedData: Partial<UserData>) => void;
}

export default function EditProfile({
  isOpen,
  onClose,
  userData,
  onUpdate,
}: EditProfileProps) {
  const [name, setName] = useState(userData.name);
  const [email, setEmail] = useState(userData.email);
  const [username, setUsername] = useState(userData.username);
  const [profilePicture, setProfilePicture] = useState(userData.profilePicture);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);

  // Mock database usernames
  const mockUsernames = ["john_doe", "jane_doe", "user123"];

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePicture(imageUrl);
    }
  };

  // Check username availability
  const handleUsernameChange = (value: string) => {
    setUsername(value);
    // Mock database check
    setIsUsernameAvailable(!mockUsernames.includes(value.toLowerCase()));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUsernameAvailable) {
      onUpdate({ name, email, username, profilePicture });
      alert("Profile updated!");
      onClose();
    } else {
      alert("The username is already taken. Please choose another.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold">Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          {/* Profile Picture Upload */}
          <div className="mb-4 flex flex-col items-center">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="mb-2 h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="mb-2 flex h-24 w-24 items-center justify-center rounded-full">
                <FaUser className="text-6xl" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500"
            />
          </div>

          {/* Name Input */}
          <div className="mb-4">
            <label className="block text-sm font-semibold">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border p-2"
            />
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border p-2"
            />
          </div>

          {/* Username Input */}
          <div className="mb-4">
            <label className="block text-sm font-semibold">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              className={`mt-1 w-full rounded-lg border p-2 ${
                isUsernameAvailable ? "border-gray-300" : "border-red-500"
              }`}
            />
            {!isUsernameAvailable && (
              <p className="mt-1 text-sm text-red-500">
                Username is already taken.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-4 py-2 font-semibold text-gray-600 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
