import { useState } from "react";

const Blog = ({ blog, user, incrementLikes, deleteBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const canBeRemoved = user.username === blog.user.username;

  const [visible, setVisibility] = useState(false);

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}{" "}
      <button
        onClick={() => {
          setVisibility(!visible);
        }}
      >
        {visible ? "hide" : "view"}
      </button>
      {visible && (
        <>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}{" "}
            <button
              onClick={() => {
                incrementLikes(blog.id);
              }}
            >
              like
            </button>
          </div>
          <div>{user.username}</div>
          {canBeRemoved && (
            <button
              onClick={() => {
                deleteBlog(blog.id);
              }}
            >
              remove
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Blog;
