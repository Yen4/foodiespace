var express = require("express");
var router = express.Router();
var Restaurant = require("../models/restaurant");
var middleware = require("../middleware");

// INDEX - show all restaurants
router.get("/", function(req, res){
    //get all restaurants dfrom DB
    Restaurant.find({}, function(err, allRestaurants){
        if(err){
            console.log(err);
        } else {
            res.render("restaurants/index", {restaurants: allRestaurants, currenUser: req.user});
        }
    });
    
});

// CREATE - add new restaurant to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    //res.send("You hit the post route"); for test
    //get data from form and add to restaurant array
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newRestaurant = {name: name, price: price, image: image, description: desc, author: author}
    // Create a new restaurant and save to DB
    Restaurant.create(newRestaurant, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to restaurant page
            console.log(newlyCreated)
            res.redirect("/restaurants");
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("restaurants/new.ejs");
});

// SHOW - shows more info about one restaurant
router.get("/:id", function(req, res){
    // find the restaurant with provided ID
    Restaurant.findById(req.params.id).populate("comments").exec(function(err, foundRestaurant){
        if(err){
            console.log(err);
        } else {
            console.log(foundRestaurant);
            // reder show template with that restaurant
            res.render("restaurants/show", {restaurant: foundRestaurant});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkRestaurantOwnership, function(req, res){
    // if user logged in ??
        Restaurant.findById(req.params.id, function(err, foundRestaurant){
            res.render("restaurants/edit", {restaurant: foundRestaurant});
        });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkRestaurantOwnership, function(req, res){
    // find and update the correct restaurant
    Restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant, function(err, updatedRestaurant){
        if(err){
            res.redirect("/restaurants");
        } else {
            res.redirect("/restaurants/" + req.params.id);
        }
    })
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkRestaurantOwnership, function(req, res){
    Restaurant.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/restaurant/");
        } else {
            res.redirect("/restaurants");
        }
    })
});

// middleware
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

// function checkRestaurantOwnership(req, res, next){
//     if(req.isAuthenticated()){
//         Restaurant.findById(req.params.id, function(err, foundRestaurant){
//             if(err){
//                 res.redirect("back");
//             } else {
//                 //does the user own the restaurant ??
//                 if(foundRestaurant.author.id.equals(req.user._id)){
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