const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/");
const endPoint = require("../endpoints.json");
beforeEach(() => seed(testData));

afterAll(() => {
  db.end();
});

describe("Get topics", () => {
  test("App request should return an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((result) => {
        result.body.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
          expect(result.body).toHaveLength(3);
        });
      });
  });
});

describe("Get API", () => {
  test("API request should return the object from endpoints.json", () => {
    return request(app)
      .get("/api/")
      .expect(200)
      .then((result) => {
        expect(endPoint).toEqual(result.body);
        /*expect(result.body).toHaveProperty("GET /api", expect.any(Object));
        expect(result.body).toHaveProperty("GET /api/topics", expect.any(Object));
        expect(result.body).toHaveProperty("GET /api/articles", expect.any(Object));*/
      });
  });
});

describe("Get API", () => {
  test("API request should return the object from endpoints.json", () => {
    return request(app)
      .get("/api/")
      .expect(200)
      .then((result) => {
        expect(endPoint).toEqual(result.body);
      });
  });
});

describe("Get article by ID", () => {
  test("A request for a particular id should return an article object with the correct properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((result) => {
        expect(result.body).toHaveProperty("article_id", 1);
        expect(result.body).toHaveProperty(
          "title",
          "Living in the shadow of a great man"
        );
        expect(result.body).toHaveProperty("author", "butter_bridge");
        expect(result.body).toHaveProperty(
          "body",
          "I find this existence challenging"
        );
        expect(result.body).toHaveProperty(
          "article_img_url",
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
        expect(result.body).toHaveProperty("topic", "mitch");
        expect(result.body).toHaveProperty("votes", 100);
        expect(result.body).toHaveProperty("created_at");
      });
  });
  test("A request for a particular id should return an article object with the correct properties", () => {
    return request(app)
      .get("/api/articles/7")
      .expect(200)
      .then((result) => {
        expect(result.body).toHaveProperty("article_id", 7);
        expect(result.body).toHaveProperty("title", "Z");
        expect(result.body).toHaveProperty("author", "icellusedkars");
        expect(result.body).toHaveProperty("body", "I was hungry.");
        expect(result.body).toHaveProperty(
          "article_img_url",
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
        expect(result.body).toHaveProperty("topic", "mitch");
        expect(result.body).toHaveProperty("votes", 0);
        expect(result.body).toHaveProperty("created_at");
      });
  });
  test("400: Responds with an error message when passed an invalid ID", () => {
    return request(app)
      .get("/api/articles/invalidID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: ID invalid");
      });
  });
  test("404: Responds with an error message when passed a valid ID who's article doesn't exist", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Article doesn't exist");
      });
  });
});

describe("Get comments by ID", () => {
  test("200: The request should return an array of comments for the given ID", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((result) => {
        expect(Array.isArray(result.body)).toBe(true);
      });
  });
  test("200: The comment array should have the correct properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((result) => {
        result.body.forEach((comment) => {
          expect(comment).toHaveProperty("article_id", 1);
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
        });
      });
  });

  test("200: Returns an empty array for an article with no comments", () => {
    return request(app)
      .get("/api/articles/7/comments")
      .expect(200)
      .then((result) => {
        expect(result.body).toEqual([]);
      });
  });

  test("400: Responds with an error message when passed an invalid ID", () => {
    return request(app)
      .get("/api/articles/invalidID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: ID invalid");
      });
  });
  test("404: Responds with an error message when passed a valid ID who's article doesn't exist", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Article doesn't exist");
      });
  });
});
