var express = require("express");
var router = express.Router();

var Campground = require("../models/campground");
var middleware = require("../middleware");






//INDEX- show all campgrounds
router.get("/", function(req, res){
    
    //Get all campgrounds from db
    Campground.find({}, function(err, allcampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allcampgrounds, currentUser: req.user});
        }
    });
    
});

//CREATE- add new campgrounds to database
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.descripion;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampGround = {name: name, image: image, description: desc, author: author}
    //create a new campground and save to db
    Campground.create(newCampGround, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else{
            res.redirect("/campgrounds");
        }
    });



});



//NEW- add campground to database
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

router.get("/:id", function(req, res){
    //find the campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err,FoundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(FoundCampground);
            res.render("campgrounds/show", {campground: FoundCampground});
        }
    });
    //render show template with that campground

});

//Edit Campground ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
        Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
        });
});


//update campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    //redirect somewhere(show page)
});



//Destroy campground route

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
           res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds");
        }
    })
});






module.exports = router;