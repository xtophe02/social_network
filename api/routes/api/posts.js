const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load model
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

// Validation
const validatePostInput = require("../../validation/post");

// @route       GET api/posts/test
// @description Tests post route
// @access      Public
router.get("/test", (req, res) =>
  res.json({
    msg: "Posts Works"
  })
);

// @route       POST api/posts/comment/:id
// @description Add comment to post
// @access      Private
router.post("/comment/:id", passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const {
    errors,
    isValid
  } = validatePostInput(req.body);

  //check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  Post.findById(req.params.id)
    .then(post => {
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
      }

      //add to comments array
      post.comments.unshift(newComment)

      //Save
      post.save().then(post => res.json(post))
    })
    .catch(err => res.status(404).json({
      postnotfound: 'No post found'
    }))

});

// @route       DELETE api/posts/comment/:id/:comment_id
// @description Remove comment from post
// @access      Private
router.delete("/comment/:id/:comment_id", passport.authenticate('jwt', {
  session: false
}), (req, res) => {

  Post.findById(req.params.id)
    .then(post => {
      // Check if comment exists
      if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
        return res.status(404).json({
          commentnotexists: 'Comment does not exist'
        })
      }

      //Get remove index
      const removeIndex = post.comments
        .map(item => item._id.toString())
        .indexOf(req.params.comment_id)

      // splice comment out of array
      post.comments.splice(removeIndex, 1)
      post.save().then(post => res.json(post))
    })
    .catch(err => res.status(404).json({
      postnotfound: 'No post found'
    }))

});

// @route       POST api/posts/like/:id
// @description GLike Post
// @access      Private
router.post("/like/:id", passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //to check if user already liked
          if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({
              alreadyliked: 'User already liked this post'
            })
          }

          //Add user id to likes array
          post.likes.unshift({
            user: req.user.id
          });
          post.save().then(post => res.json(post))
        })
    })
});

// @route       POST api/posts/unlike/:id
// @description unLike Post
// @access      Private
router.post("/unlike/:id", passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //to check if user already liked
          if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({
              notliked: 'You have not yet liked this post'
            })
          }

          //Get remove index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          // Splice out of array
          post.likes.splice(removeIndex, 1)

          post.save().then(post => res.json(post))
        })
    })
});

// @route       GET api/posts
// @description Get Posts
// @access      Public
router.get("/", (req, res) => {
  Post.find()
    .sort({
      date: -1
    })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({
      nopostfound: "no posts found"
    }));
});

// @route       GET api/posts/:id
// @description Get Post by id
// @access      Public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(posts => res.json(posts))
    .catch(err =>
      res.status(404).json({
        nopostfound: "No post found with that ID"
      })
    );
});

// @route       POST api/posts
// @description Create Posts
// @access      Private
router.post(
  "/",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    const {
      errors,
      isValid
    } = validatePostInput(req.body);

    //check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    // console.log(newPost)

    newPost.save().then(post => res.json(post));
  }
);

// @route       DELETE api/posts/:id
// @description Delete Posts
// @access      Private
router.delete(
  "/:id",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    Profile.findOne({
      user: req.user.id
    }).then(profile => {
      Post.findById(req.params.id).then(post => {
        //Check post owner
        console.log(post);
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({
            notauthorized: "User not authorized"
          });
        }
        //Delete
        post
          .remove()
          .then(() => res.json({
            sucess: true
          }))
          .catch(err =>
            res.status(404).json({
              nopostfound: "No post found with that ID"
            })
          );
      });
    });
  }
);

module.exports = router;