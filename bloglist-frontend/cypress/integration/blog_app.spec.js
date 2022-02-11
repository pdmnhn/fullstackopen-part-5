describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user = {
      name: "Padmanabhan",
      username: "pdmnhn",
      password: "testing-password",
    };
    cy.request("POST", "http://localhost:3003/api/users", user);
    cy.visit("http://localhost:3000");
  });

  it("Login form is shown", function () {
    cy.get("#login-form").should("be.visible");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("#username").type("pdmnhn");
      cy.get("#password").type("testing-password");
      cy.get("#login-button")
        .click()
        .then(() => {
          cy.get("html").should("contain", "pdmnhn logged in");
        });
    });

    it("fails with wrong credential", function () {
      cy.get("#username").type("pdmnhn");
      cy.get("#password").type("blah blah");
      cy.get("#login-button")
        .click()
        .then(() => {
          cy.get("html").should("not.contain", "pdmnhn logged in");
        });
    });

    describe("When logged in", function () {
      beforeEach(function () {
        cy.get("#username").type("pdmnhn");
        cy.get("#password").type("testing-password");
        cy.get("#login-button").click();
      });

      it("A blog can be created", function () {
        const blog = {
          title: "Full Stack Open is a boon for learners",
          author: "pdmnhn",
          url: "example.com/blog/fso-is-amazing",
        };
        cy.createBlog(blog).then(() => {
          cy.get("html").should("contain", blog.title + " " + blog.author);
        });
      });

      it("A blog can be liked", function () {
        const blog = {
          title: "How to blog as a developer",
          author: "pdmnhn",
          url: "example.com/blog/blog-as-dev",
        };
        cy.createBlog(blog);
        cy.contains(blog.title + " " + blog.author)
          .contains("view")
          .click();

        cy.get(".like-button")
          .click()
          .then(() => {
            cy.get(".conditionally-rendered").should("contain", "likes 1");
          });
      });

      it("A blog can be deleted", function () {
        const blog = {
          title: "How to become a YouTuber as a developer",
          author: "pdmnhn",
          url: "example.com/blog/ytber-as-dev",
        };
        cy.createBlog(blog);
        cy.contains(blog.title + " " + blog.author)
          .contains("view")
          .click();

        cy.get(".conditionally-rendered")
          .contains("remove")
          .click()
          .then(() => {
            cy.get("html").should(
              "not.contain",
              blog.title + " " + blog.author
            );
          });
      });

      it("Blogs are ordered according to likes", function () {
        const blogs = [
          {
            title: "How to become a YouTuber as a developer",
            author: "pdmnhn",
            url: "example.com/blog/ytber-as-dev",
            likes: 4,
          },
          {
            title: "How to succeed financially as a developer",
            author: "pdmnhn",
            url: "example.com/blog/finance-as-dev",
            likes: 10,
          },
        ];

        const createAndLike = (blog, likes) => {
          const searchFor = blog.title + " " + blog.author;

          if (likes === blog.likes) {
            cy.createBlog(blog);
            cy.contains(searchFor).contains("view").click();
          } else {
            cy.contains(searchFor).contains("like").as("likeButton");
            cy.get("@likeButton").click();
          }

          cy.contains(searchFor).within(() => {
            cy.get(".likes").then((res) => {
              cy.wrap(res)
                .should("have.text", (blog.likes - likes).toString())
                .then(() => {
                  if (likes > 0) {
                    createAndLike(blog, likes - 1);
                  }
                });
            });
          });
        };

        createAndLike(blogs[0], blogs[0].likes);
        createAndLike(blogs[1], blogs[1].likes);

        cy.get(".likes").then((res) => {
          cy.wrap(res[0]).should("have.text", "10");
          cy.wrap(res[1]).should("have.text", "4");
        });
      });
    });
  });
});
