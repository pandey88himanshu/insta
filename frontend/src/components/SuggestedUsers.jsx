import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import axios from "axios";

const SuggestedUsers = () => {
  const { userProfile } = useSelector((store) => store.auth);
  const [isFollowing, setIsFollowing] = useState(false);
  const { suggestedUsers = [] } = useSelector((store) => store.auth); // Ensure it's always an array
  const handleFollow = async () => {
    try {
      const response = await axios.post(
        `https://insta-bo5p.onrender.com/api/v1/user/followorunfollow/${userProfile?._id}`,
        {},
        {
          withCredentials: true, // if you are using cookies for authentication
        }
      );

      if (response.data.success) {
        setIsFollowing((prev) => !prev); // Toggle the follow status
        toast.success(response.data.message); // Show success toast
      } else {
        toast.error(response.data.message); // Show error toast
      }
    } catch (error) {
      console.error("Error following/unfollowing:", error);
      toast.error("Something went wrong! Please try again.");
    }
  };
  return (
    <div className='my-10'>
      <div className='flex items-center justify-between text-sm'>
        <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
        <span className='font-medium cursor-pointer'>See All</span>
      </div>

      {Array.isArray(suggestedUsers) && suggestedUsers.length > 0 ? (
        suggestedUsers.map((user) => (
          <div
            key={user._id}
            className='flex items-center justify-between my-5'>
            <div className='flex items-center gap-2'>
              <Link to={`/profile/${user?._id}`}>
                <Avatar>
                  <AvatarImage
                    src={user?.profilePicture}
                    alt={user?.username}
                  />
                  <AvatarFallback>
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <h1 className='font-semibold text-sm'>
                  <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
                </h1>
                <span className='text-gray-600 text-sm'>
                  {user?.bio.slice(0, 15) || "Bio here..."}
                </span>
              </div>
            </div>
            <span className='text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]'>
              View
            </span>
          </div>
        ))
      ) : (
        <p className='text-gray-500 text-sm mt-4'>No suggested users found.</p>
      )}
    </div>
  );
};

export default SuggestedUsers;
