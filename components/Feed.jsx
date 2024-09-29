"use client";

import { useState, useEffect, useCallback } from "react";
import PromptCard from "./PromptCard";
import Loading from "./Loading"; // Import the Loading component

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="prompt_layout mt-16">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true); // Set loading to true before fetching

      const response = await fetch("/api/prompt");
      const data = await response.json();

      setPosts(data);
      setFilteredPosts(data); // Initially display all posts
      setLoading(false); // Set loading to false after fetching
    };

    fetchPosts();
  }, []);

  // Memoize the filterPosts function to avoid recreating it on every render
  const filterPosts = useCallback(
    (searchText) => {
      const filtered = posts.filter(
        (post) =>
          post.prompt.toLowerCase().includes(searchText.toLowerCase()) ||
          post.tag.toLowerCase().includes(searchText.toLowerCase()) ||
          post.creator.username.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredPosts(filtered);
    },
    [posts] // posts as dependency for filtering
  );

  // Debounce search input to avoid too many re-renders
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchText === "") {
        // If searchText is empty, show all posts
        setFilteredPosts(posts);
      } else {
        filterPosts(searchText); // Otherwise, filter based on the searchText
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn); // Cleanup debounce timeout on each keystroke
  }, [searchText, posts, filterPosts]); // Ensure filterPosts is memoized

  // Show loading component if still fetching data
  if (loading) {
    return <Loading />;
  }

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          className="search_input peer"
          placeholder="Search for a tag, prompt, or username"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </form>

      <PromptCardList
        data={filteredPosts}
        handleTagClick={(tag) => {
          setSearchText(tag);
          filterPosts(tag);
        }}
      />
    </section>
  );
};

export default Feed;