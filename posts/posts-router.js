const express = require("express");

const Posts = require("../data/db");

const router = express.Router();

//POST A POST
router.post("/", (req, res) => {
  const data = req.body;
  if (!data.title || !data.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  } else if (data.title && data.contents) {
    Posts.insert(data)
      .then(post => {
        res.status(201).json(post);
      })
      .catch(err => {
        console.log("DB error on insert...", err);
        res.status(500).json({
          message: "Error inserting the post"
        });
      });
  } else {
    res.status(500).json({
      message: "Error inserting the post"
    });
  }
});

//POST A COMMENT TO A SPECIFIC POST
router.post("/:id/comments", (req, res) => {
  const data = req.body;
  const { id } = req.params;

  Posts.findById(id).then(post => {
    console.log("post", post);
    if (!post.length) {
      res.status(404).json({
        message: "The post with the specified ID does not exist."
      });
    } else if (!data.text) {
      res.status(400).json({
        errorMessage: "Please provide text for the comment."
      });
    } else if (data.text) {
      Posts.insertComment(data)
        .then(comment => {
          res.status(201).json(data.text);
        })
        .catch(err => {
          console.log("Error inserting comment to DB...", err);
          res.status(500).json({
            error: "There was an error while saving the comment to the database"
          });
        });
    }
  });
});

//GET ALL POSTS
router.get("/", (req, res) => {
  Posts.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      console.error("Error getting posts from DB...", err);
      res.status(500).json({
        error: "The posts information could not be retrieved."
      });
    });
});

//GET POST BY ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  Posts.findById(id)
    .then(post => {
      if (!post.length) {
        res.status(404).json({
          message: "The post with the specified ID does not exist."
        });
      } else {
        res.status(200).json(post);
      }
    })
    .catch(err => {
      console.error("Error getting single post from DB...,", err);
      res.status(500).json({
        error: "The comments information could not be retrieved."
      });
    });
});

//GET COMMENTS BY POST ID
router.get("/:id/comments", (req, res) => {
  const { id } = req.params;

  Posts.findById(id).then(post => {
    if (!post.length) {
      res.status(404).json({
        message: "The post with the specified ID does not exist."
      });
    } else if (post.length) {
      Posts.findPostComments(id).then(comm => {
        if (!comm.length) {
          res.status(500).json({
            error: "The comments information could not be retrieved."
          });
        } else if (comm.length) {
          res.status(200).json(comm);
        }
      });
    }
  });
});

//DELETE POST BY ID
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  Posts.findById(id).then(post => {
    if (!post.length) {
      res.status(404).json({
        message: "The post with the specified ID does not exist."
      });
    } else if (post.length) {
      Posts.remove(id)
        .then(dlt => {
          res.status(200).json({
            "This post was deleted": post[0]
          });
        })
        .catch(err => {
          res.status(500).json({
            error: "The post could not be removed"
          });
        });
    }
  });
});

//UPDATE POST BY ID
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const data = req.body;

  Posts.findById(id).then(post => {
    if (!post.length) {
      res.status(404).json({
        message: "The post with the specified ID does not exist."
      });
    } else if (post.length) {
      if (!data.title || !data.contents) {
        res.status(400).json({
          errorMessage: "Please provide title and contents for the post."
        });
      } else if (data.title && data.contents) {
        Posts.update(id, data)
          .then(upd => {
            res.status(200).json(data);
          })
          .catch(err => {
            console.log("Error updating post in DB...", err);
            res.status(500).json({
              error: "The post information could not be modified."
            });
          });
      }
    }
  });
});

module.exports = router;
