import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Blog from "./Blog";

describe("testing blog comp for it's proper functionality", () => {
  let component;

  const incrementLikes = jest.fn();
  const deleteBlog = jest.fn();

  const egBlog = {
    id: "some-random-string",
    title: "this is testing title",
    author: "tester",
    url: "example.com",
    likes: 10,
    user: {
      username: "different",
    },
  };

  beforeEach(() => {
    component = render(
      <Blog
        blog={egBlog}
        user={{ username: "something" }}
        incrementLikes={incrementLikes}
        deleteBlog={deleteBlog}
      />
    );
  });

  test("blog renders the title and author but does not render its url or number of likes by default", () => {
    const blog = component.container.querySelector(".blogComp");
    expect(blog).toHaveTextContent("this is testing title tester");

    const hidden = component.container.querySelector(".conditionally-rendered");
    expect(hidden).toBe(null);
  });

  test("blogs renders also the url and likes when button is clicked", () => {
    const viewButton = component.getByText("view");
    fireEvent.click(viewButton);
    const urlAndLikes = component.container.querySelector(
      ".conditionally-rendered"
    );
    expect(urlAndLikes).not.toBe(null);
  });

  test("blogs renders also the url and likes when button is clicked", () => {
    const viewButton = component.getByText("view");
    fireEvent.click(viewButton);
    const likeButton = component.container.querySelector(".like-button");
    fireEvent.click(likeButton);
    fireEvent.click(likeButton);
    expect(incrementLikes.mock.calls).toHaveLength(2);
    expect(incrementLikes.mock.calls[0][0]).toBe(egBlog.id);
    expect(incrementLikes.mock.calls[1][0]).toBe(egBlog.id);
  });
});
