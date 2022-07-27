const { Router } = require('express')
const express = require('express')
const Routes = express.Router()
const controller = require('../controller/controller')




Routes.get('/', controller.Home)
Routes.get('/games', controller.Game)
Routes.get('/login', (req, res) => {
     res.render('login')
})
Routes.post('/login', controller.login)
Routes.post('/register', controller.Register)
Routes.get('/register', controller.RegisterView)
Routes.post('/games',controller.GameHistory)
Routes.get('/games/score/:id',controller.getScore)
Routes.get('/super-user',controller.superView)
Routes.post('/super-user', controller.userUpdate)
Routes.get('/remove/:id', controller.deleteUser)
Routes.get('/user-profile/:id', controller.profileUser)
Routes.post('/user-profile/:id',controller.updateProfile)


module.exports = Routes

