var express = require("express");
var router = express.Router({mergeParams: true});
var Restaurant = require("../models/restaurant");
var Comment = require("../models/comment");
var middleware = require("../middleware"); // index.js will be required as default, same in npm module

// Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find restaurant by ID
    Restaurant.findById(req.params.id, function(err, restaurant){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new", {restaurant: restaurant});
        }
    })
});

// Comments Create
router.post("/", middleware.isLoggedIn, function(req, res){
    // lookup restaurant through ID
    Restaurant.findById(req.params.id, function(err, restaurant){
        if(err){
            console.log(err);
            res.redirect("/restaurants");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    restaurant.comments.push(comment);
                    restaurant.save();
                    console.log(comment);
                    req.flash("success", "Successfully added comment");
                    res.redirect("/restaurants/"+ req.params.id);
                }
            })
        }
    });
    // create new comment
    // connect new comment to restaurant
    // redirect
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            console.log(err);
            console.log(req.params.comment_id);
            res.redirect("back");
        } else {
            res.render("comments/edit", {restaurant_id: req.params.id, comment: foundComment});
        }
    })
});

// COMMENT UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/restaurants/" + req.params.id);
        }
    });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAnd Remove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else{
            req.flash("success", "Comment deleted");
            res.redirect("/restaurants/" + req.params.id);
        }
    })
})

// middleware
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

// function checkCommentOwnership(req, res, next){
//     if(req.isAuthenticated()){
//         Comment.findById(req.params.comment_id, function(err, foundComment){
//             if(err){
//                 res.redirect("back");
//             } else {
//                 //does the user own the comment ??
//                 console.log(foundComment);
//                 if(foundComment.author.id.equals(req.user._id)){
//                     next();
//                 } else {
//                     res.redirect("back");
//                 }
//             }
//         });
//     } else {
//         res.redirect("back");
//     }
// }

module.exports = router;