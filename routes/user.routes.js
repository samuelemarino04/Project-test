const express = require('express');
const { isLoggedIn, checkRoles } = require('../middlewares/route-guard');
const router = express.Router();
const User = require("../models/User.model")


router.get("/profile", isLoggedIn, (req, res) => {

    res.render("user/personalprofile", { loggedUser: req.session.currentUser });
})


//list
router.get('/list', isLoggedIn, (req, res) => {

    User
        .find()
        .then(users => res.render('user/profile-list', { users }))
        .catch(err => console.log(err))
})

router.get('/:user_id', isLoggedIn, checkRoles('USER', "ADMIN"), (req, res) => {
    const loggedUser = req.session.currentUser
    const { user_id } = req.params

    const userRoles = {
        isPm: req.session.currentUser?.role === 'ADMIN',
        isUserId: req.session.currentUser?._id === user_id
    }
    if (userRoles.isPm || userRoles.isUserId) {
        User
            .findById(user_id)
            .then(user => res.render('user/profiles', { user, userRoles, loggedUser }))
            .catch(err => console.log(err))
    }
    else
        res.redirect('/user/list')
})

router.get("/:user_id/edit", isLoggedIn, checkRoles('USER', 'ADMIN'), (req, res) => {
    const loggedUser = req.session.currentUser

    const { user_id } = req.params

    User
        .findById(user_id)
        .then(user => res.render("user/edit", { user, loggedUser }))
        .catch(err => console.log(err))
})

router.post('/:user_id/edit', isLoggedIn, (req, res) => {

    const { user_id } = req.params
    const { email, userPwd, username, profileImg, bio } = req.body

    User
        .findByIdAndUpdate(user_id, { email, userPwd, username, profileImg, bio })
        .then(user => res.redirect(`/user/${user._id}`))
        .catch(err => console.log(err))
})

router.post('/:user_id/delete', isLoggedIn, (req, res) => {

    const { user_id } = req.params

    User
        .findByIdAndDelete(user_id)
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
})



module.exports = router