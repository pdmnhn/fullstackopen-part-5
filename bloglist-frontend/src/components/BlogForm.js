import { useState } from "react";
import PropTypes from "prop-types";

const BlogForm = ({ createNewBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const submit = (event) => {
    event.preventDefault();
    createNewBlog(title, author, url);
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  const changeState = (setState) => {
    return ({ target }) => {
      setState(target.value);
    };
  };
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={submit}>
        <div>
          title:
          <input value={title} onChange={changeState(setTitle)} />
        </div>
        <div>
          author:
          <input value={author} onChange={changeState(setAuthor)} />
        </div>
        <div>
          url:
          <input value={url} onChange={changeState(setUrl)} />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

BlogForm.propTypes = {
  createNewBlog: PropTypes.func.isRequired,
};

export default BlogForm;
