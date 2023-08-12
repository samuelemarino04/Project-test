const router = require("express").Router()
const bcrypt = require('bcryptjs')
const User = require("../models/User.model")

const saltRounds = 10

router.get('/sign-up', (req, res, next) => res.render('auth/sign-up'))
router.post('/sign-up', (req, res, next) => {

    const { email, userPwd, username, profileImg, bio } = req.body

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(userPwd, salt))
        .then(hashedPassword => User.create({ email, username, bio, profileImg, password: hashedPassword }))
        .then(createdUser => res.redirect('/auth/login'))
        .catch(error => next(error))
})



// Login
router.get('/login', (req, res, next) => res.render('auth/login'))
    / router.post('/login', (req, res, next) => {

        const { email, userPwd } = req.body

        User
            .findOne({ email })
            .then(user => {
                if (!user) {
                    res.render('auth/login', { errorMessage: 'Email no registrado en la Base de Datos' })
                    return
                } else if (bcrypt.compareSync(userPwd, user.password) === false) {
                    res.render('auth/login', { errorMessage: 'La contraseña es incorrecta' })
                    return
                } else {
                    req.session.currentUser = user
                    res.redirect('/user/profile')
                }
            })
            .catch(error => next(error))
    })


// Logout
router.post('/logout', (req, res, next) => {
    req.session.destroy(() => res.redirect('/auth/login'))
})


module.exports = router