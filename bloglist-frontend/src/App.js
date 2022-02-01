import React, { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [info, setInfo] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("user");
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      setUser(user);
      blogService.setToken(user.token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearInfo = () => {
    setTimeout(() => {
      setInfo("");
    }, 5000);
  };

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            value={username}
            name="username"
            onChange={changeState(setUsername)}
          />
        </div>
        <div>
          password
          <input
            value={password}
            name="password"
            type="password"
            onChange={changeState(setPassword)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );

  const newBlogForm = () => (
    <div>
      <h2>create new</h2>
      <form onSubmit={createNewBlog}>
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

  const changeState = (setState) => {
    return ({ target }) => setState(target.value);
  };

  const createNewBlog = async (event) => {
    event.preventDefault();
    try {
      const newBlog = await blogService.createNewBlog({ title, author, url });
      setBlogs(blogs.concat(newBlog));
      setInfo(`a new blog ${newBlog.title} added`);
      clearInfo();
    } catch (error) {
      setInfo("title and url are required to create a new blog");
      clearInfo();
    } finally {
      setTitle("");
      setAuthor("");
      setUrl("");
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await blogService.login({ username, password });
      blogService.setToken(user.token);
      window.localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } catch (error) {
      setInfo("wrong username or password");
      clearInfo();
    } finally {
      setUsername("");
      setPassword("");
    }
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem("user");
  };

  return (
    <div>
      {info && <h3>{info}</h3>}
      {!user && loginForm()}
      {user && (
        <div>
          <h2>blogs</h2>
          <p>
            {user.username} logged in <button onClick={logout}>logout</button>
          </p>
          {newBlogForm()}
          <br></br>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
