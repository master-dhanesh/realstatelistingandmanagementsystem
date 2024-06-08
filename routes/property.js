var express = require("express");
var router = express.Router();
const { isLoggedIn } = require("../utility/auth");
const PropertySchema = require("../models/propertySchema");
const upload = require("../utility/multer");

router.get("/", isLoggedIn, function (req, res, next) {
    res.render("createproperty");
});

function verifyrole(req, res, next) {
    if (req.user.role == "seller" || req.user.role == "agent") {
        next();
    } else {
        res.send("Only seller the permission to create property");
    }
}

router.post(
    "/",
    isLoggedIn,
    verifyrole,
    upload.single("image"),
    async function (req, res, next) {
        try {
            const newproperty = new PropertySchema({
                ...req.body,
                image: req.file.filename,
                owner: req.user._id,
            });
            await newproperty.save();
            res.redirect("/user");
        } catch (error) {
            res.send(error.message);
        }
    }
);

module.exports = router;
