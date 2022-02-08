import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import BlogForm from "./BlogForm";

test("event handler receives the right details when new blog is created", () => {
  const createNewBlog = jest.fn();

  const component = render(<BlogForm createNewBlog={createNewBlog} />);

  const title = component.container.querySelector("#title");
  const author = component.container.querySelector("#author");
  const url = component.container.querySelector("#url");

  fireEvent.change(title, { target: { value: "blog title" } });
  fireEvent.change(author, { target: { value: "some blog author" } });
  fireEvent.change(url, { target: { value: "boring.com/blog-title" } });

  const form = component.container.querySelector("form");
  fireEvent.submit(form);

  expect(createNewBlog.mock.calls).toHaveLength(1);
  expect(createNewBlog.mock.calls[0][0]).toBe("blog title");
  expect(createNewBlog.mock.calls[0][1]).toBe("some blog author");
  expect(createNewBlog.mock.calls[0][2]).toBe("boring.com/blog-title");
});
