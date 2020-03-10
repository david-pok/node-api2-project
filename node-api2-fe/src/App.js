import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: "",
    contents: ""
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/posts")
      .then(res => {
        console.log("get res", res);
        setPosts(res.data);
      })
      .catch(err => {
        console.error("Error getting data from DB server...", err);
      });
  }, []);

  const handlePost = e => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/posts", newPost)
      .then(res => {
        console.log("post post res", res);
        let id = res.data.id;
        newPost["id"] = id;
        setPosts([...posts, newPost]);
        setNewPost({
          title: "",
          contents: ""
        });
      })
      .catch(err => {
        console.error("Error inserting post to DB server...", err);
      });
  };

  const handleChange = e => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handleDelete = id => {
    axios
      .delete(`http://localhost:5000/api/posts/${id}`)
      .then(res => {
        // console.log("delete res", res);
        const newP = posts.filter(post => post.id !== id);
        setPosts(newP);
      })
      .catch(err => {
        console.error("Error deleting post from DB server...", err);
      });
  };

  console.log("posts", posts);
  return (
    <div className="App">
      <form onSubmit={handlePost}>
        <label>Enter a new post</label>
        <input
          onChange={handleChange}
          name="title"
          value={newPost.title}
        ></input>
        <input
          onChange={handleChange}
          name="contents"
          value={newPost.contents}
        ></input>
        <button>Submit</button>
      </form>
      {posts.map(post => (
        <div key={post.id} className="posts">
          <p>{post.title}</p>
          <p>{post.contents}</p>
          <button
            onClick={() => {
              handleDelete(post.id);
            }}
          >
            Delete Post
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
