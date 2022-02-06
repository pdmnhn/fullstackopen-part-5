import { useState, useEffect, useRef } from "react";
import Togglable from "./components/Togglable";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Blog from "./components/Blog";
import blogService from "./services/blogs";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [info, setInfo] = useState("");
  const [user, setUser] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
    const loggedUser = window.localStorage.getItem("user");
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const setInfoMessage = (message) => {
    setInfo(message);
    setTimeout(() => {
      setInfo("");
    }, 5000);
  };

  const createNewBlog = async (title, author, url) => {
    try {
      const newBlog = await blogService.createNewBlog({ title, author, url });
      setBlogs(blogs.concat(newBlog));
      setInfoMessage(`a new blog ${newBlog.title} added`);
    } catch (error) {
      setInfoMessage("title and url are required to create a new blog");
    } finally {
      blogFormRef.current.toggleVisibility();
    }
  };

  const handleLogin = async (username, password) => {
    try {
      const user = await blogService.login({ username, password });
      blogService.setToken(user.token);
      window.localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } catch (error) {
      setInfoMessage("wrong username or password");
    }
  };

  const incrementLikes = async (id) => {
    const blogsCopy = [...blogs];
    const blogIndex = blogsCopy.findIndex((blog) => blog.id === id);
    const blog = blogsCopy[blogIndex];
    ++blog.likes;
    blogsCopy[blogIndex] = await blogService.updateBlog(blog, blog.id);
    setBlogs(blogsCopy);
  };

  const deleteBlog = async (id) => {
    const { title, author } = blogs.find((blog) => blog.id === id);
    const responseByUser = window.confirm(`Remove ${title} by ${author}`);
    if (responseByUser) {
      await blogService.deleteBlog(id);
      setBlogs(
        blogs.filter((blog) => {
          if (blog.id !== id) {
            return true;
          }
          setInfoMessage(`${blog.title} by ${blog.author} is removed`);
          return false;
        })
      );
    }
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem("user");
  };

  return (
    <div>
      <h1>Blog list</h1>
      {info && <h3>{info}</h3>}
      {!user && (
        <Togglable buttonText="log in">
          <LoginForm handleLogin={handleLogin} />
        </Togglable>
      )}
      {user && (
        <div>
          <h2>blogs</h2>
          <p>
            {user.username} logged in <button onClick={logout}>logout</button>
          </p>
          <Togglable buttonText="create new blog" ref={blogFormRef}>
            <BlogForm createNewBlog={createNewBlog} />
          </Togglable>
          <br></br>
          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              user={user}
              incrementLikes={incrementLikes}
              deleteBlog={deleteBlog}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
