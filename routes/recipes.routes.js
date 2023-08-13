const express = require('express');
const { isLoggedIn, checkRoles } = require('../middlewares/route-guard');
const router = express.Router();
const User = require("../models/User.model")
const Recipe = require("../models/Recipe.model")



router.get("/", isLoggedIn, (req, res) => {

    const loggedUser = req.session.currentUser
    const { user_id } = req.params
    const userRoles = {
        isPm: req.session.currentUser?.role === 'ADMIN',
        isUserId: req.session.currentUser?._id === user_id
    }
    Recipe
        .find()
        .populate('author')
        .then(recipes => {
            res.render("recipes/recipes-list", { loggedUser, recipes });
        })
})

router.get("/create", isLoggedIn, (req, res) => {

    res.render("recipes/new-recipe", { loggedUser: req.session.currentUser })
})

router.post('/create', isLoggedIn, (req, res, next) => {
    let ingredients
    if (typeof req.body.ingrName !== 'string') {
        ingredients = req.body.ingrName.map((eachIngr, idx) => {
            return ({ ingrName: eachIngr, ingrQuantity: req.body.ingrQuantity[idx] })
        });
    } else {
        ingredients = { ingrName: req.body.ingrName, ingrQuantity: req.body.ingrQuantity }
    }

    const { title, recipeImg, description } = req.body
    Recipe
        .create({ title, ingredients, recipeImg, description, author: req.session.currentUser._id })
        .then(() => res.redirect('/recipes'))

})


router.get("/:id/details", isLoggedIn, (req, res, next) => {
    const { id: recipe_id } = req.params

    Recipe
        .findById(recipe_id)
        .populate('author')
        .then(recipe => {
            if (req.session.currentUser._id === recipe.author[0].id) {
                isOwner = true
                res.render("recipes/recipe-details", { loggedUser: req.session.currentUser, recipe, isOwner })
            }

            res.render("recipes/recipe-details", { loggedUser: req.session.currentUser, recipe })
        })

        .catch(err => next(err))

})


router.get("/:id/edit", isLoggedIn, (req, res, next) => {

    const { id: recipe_id } = req.params

    Recipe
        .findById(recipe_id)
        .then(recipe => res.render("recipes/edit-recipe", { loggedUser: req.session.currentUser, recipe }))
        .catch(err => next(err))
})

router.post("/:id/edit", isLoggedIn, checkRoles, (req, res, next) => {
    const { id: recipe_id } = req.params
    let ingredients


    if (typeof req.body.ingrName !== 'string') {
        ingredients = req.body.ingrName.map((eachIngr, idx) => {
            return ({ ingrName: eachIngr, ingrQuantity: req.body.ingrQuantity[idx] })
        });
    } else {
        ingredients = { ingrName: req.body.ingrName, ingrQuantity: req.body.ingrQuantity }
    }

    const { title, recipeImg, description } = req.body
    if (recipeImg) {
        Recipe
            .findByIdAndUpdate(recipe_id, { title, ingredients, recipeImg, description })
            .then(() => res.redirect(`/recipes/${recipe_id}/details`))
            .catch(err => next())
    }
    Recipe
        .findByIdAndUpdate(recipe_id, { title, ingredients, description })
        .then(() => res.redirect(`/recipes/${recipe_id}/details`))
        .catch(err => next())

})

router.get("/:id/delete", isLoggedIn, (req, res, next) => {
    const { id: recipe_id } = req.params
    Recipe
        .findByIdAndDelete(recipe_id)
        .then(() => res.redirect('/recipes'))
        .next(err => next(err))
})





module.exports = router