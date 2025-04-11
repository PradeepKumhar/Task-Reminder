import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {updateUser} from '../utils/authSlice';


const Profile = () => {
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    const [preview, setPreview] = useState(user?.profilePic);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef();

    useEffect(() => {
        setPreview(user?.profilePic);
    }, [user?.profilePic]);

    const handleIconClick = () => {
        fileInputRef.current.click(); // Trigger file picker
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("profilePic", file);

        try {
            setLoading(true);

            const res = await fetch("http://localhost:5000/api/user/update-profile", {
               method: "PUT",
               headers: { "Authorization": `Bearer ${token}` },
               body: formData
            });

            const data = await res.json();
            if (res.ok) {
                setPreview(data.profilePic);
                dispatch(updateUser({profilePic: data.profilePic}));

                alert("Profile picture updated!");
            } else {
                alert(data.message || "Upload failed");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-xl text-center relative">
                <div className="relative w-40 h-40 mx-auto">
                    <img
                        src={preview || 'https://i.pinimg.com/474x/e4/37/a8/e437a8fc43a62e5855745132f553dcf4.jpg'}
                        alt="Profile pic"
                        className="w-40 h-40 rounded-full border-2 border-blue-500 object-cover"
                    />
                    <button
                        className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow hover:scale-110 transition"
                        onClick={handleIconClick}
                        title="Change profile picture"
                    >
                        ✏️
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />
                </div>

                {loading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}

                <h2 className="text-xl font-semibold mt-6">{user?.name || 'Batman'}</h2>
                <p className="text-gray-500 mt-1">UserID: {user?._id || 'Batman123'}</p>
                <p className="text-gray-500 mt-1">Email: {user?.email || 'Batman@gmail.com'}</p>

                <button className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Profile;
