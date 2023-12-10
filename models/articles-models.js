const db = require("../db/connection");

exports.queryArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
      FROM articles 
      LEFT JOIN comments ON comments.article_id = articles.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id`,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "404: Article doesn't exist",
        });
      }
      return result.rows[0];
    });
};

exports.queryArticles = (topic, sort_by = "created_at", order_by = "DESC") => {
  if (
    !["title", "author", "created_at", "votes"].includes(sort_by.toLowerCase())
  ) {
    return Promise.reject({ status: 400, msg: "400: Invalid sort query" });
  }

  if (!["asc", "desc"].includes(order_by.toLowerCase())) {
    return Promise.reject({ status: 400, msg: "400: Invalid order query" });
  }

  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON comments.article_id = articles.article_id
      WHERE $1::VARCHAR IS NULL
      OR topic = $1
      GROUP BY articles.article_id
      ORDER BY ${sort_by} ${order_by};`,
      [topic]
    )
    .then((result) => {
      return result.rows;
    });
};

exports.queryArticleComments = (article_id) => {
  return db
    .query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;",
      [article_id]
    )
    .then((result) => {
      return result.rows;
    });
};

exports.updateArticleVotes = (votes, article_id) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [votes.inc_votes, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
