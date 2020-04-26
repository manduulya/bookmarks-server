const express = require("express");
const bookmarkRouter = express.Router();
const { v4: uuid } = require("uuid");
const logger = require("./logger");
const bookmarks = require("./store");

bookmarkRouter
  .route("/bookmarks")
  //get all bookmarks
  .get((req, res) => {
    res.json(bookmarks);
  })
  //POST endpoint
  .post((req, res) => {
    const { title, url, description, rating } = req.body;

    if (!title) {
      logger.error("Title is required");
      return res.status(400).send("Invalid data");
    }
    if (!url) {
      logger.error("URL is required");
      return res.status(400).send("URL is needed");
    }
    if (!description) {
      logger.error("Description is required");
      return res.status(400).send("Description is missing");
    }
    if (!rating) {
      logger.error("Please rate!");
      return res.status(400).send("Rate please!");
    }
    const id = uuid();
    const bookmark = {
      id,
      title,
      url,
      description,
      rating,
    };
    bookmarks.push(bookmark);

    logger.info(`Card with id ${id} created`);
    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${id}`)
      .json(bookmarks);
  });

bookmarkRouter
  .route("/bookmarks/:id")
  //get single bookmark by ID
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = bookmarks.find((c) => c.id == id);
    //making sure we found the bookmark
    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found`);
      return res.status(404).send("Bookmark not found");
    }
    res.json(bookmark);
  })
  //Delete endpoint
  .delete((req, res) => {
    const { id } = req.params;

    const bookmarkIndex = bookmarks.findIndex((li) => li.id == id);

    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${id} not found`);
      return res.status(404).send("Not found");
    }
    bookmarks.splice(bookmarkIndex, 1);

    logger.info(`Bookmark with id ${id} deleted.`);
    res.status(204).send("Deleted").end();
  });

module.exports = bookmarkRouter;
