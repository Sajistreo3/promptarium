"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Profile from "@components/Profile";
import Loading from "@components/Loading"; // Correct

export const dynamic = 'force-dynamic'; // Ensure dynamic rendering

const UserProfile = ({ params }) => {
  const searchParams = useSearchParams();
  const userName = searchParams.get("name");

  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true); // Set loading to true before fetching

      const response = await fetch(`/api/users/${params?.id}/posts`);
      const data = await response.json();

      setUserPosts(data);
      setLoading(false); // Set loading to false once data is fetched
    };

    if (params?.id) fetchPosts();
  }, [params.id]);

 
  return (
    <Suspense fallback={<Loading />}>
      <Profile
        name={userName}
        desc={`Welcome to ${userName}'s personalized profile page. Share ${userName}'s exceptional prompts and inspire others with the power of your imagination`}
        data={userPosts}
      />
    </Suspense>
  );
};

export default UserProfile;