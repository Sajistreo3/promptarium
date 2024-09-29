"use client";

import { useState, useEffect } from "react";

import PromptCard from "./PromptCard";

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
}

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);

  const handleSearchChange = (e) => { };
  
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/prompt');
      const data = await response.json();
      
      setPosts(data);
    } 
    
    fetchPosts();
  }, []);

  return (
    <section className="feed">
      <form action="" className="reative w-full flex-center">
        <input
          type="text"
          className="search_input peer"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
        />
      </form>

      <PromptCardList
        data={posts}
        handleTagClick={() => {
          console.log("Tag Clicked");
        }}
      />
    </section>
  );
};

export default Feed;
