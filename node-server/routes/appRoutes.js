const express = require('express')
const router = express.Router()
const appController = require('../controllers/appController')
const authController = require('../controllers/authController')

router.post('/login',appController.login)
router.post('/register',appController.register)
router.get('/auth',authController.verifyJWT,(req,res) => res.status(200).json({}))
router.get('/getstore/:category?',appController.getStore)
router.get('/getstore', appController.getStore);
router.put('/updatestore/:id',appController.updateStore)
router.put('/addtocart/:id',appController.addToCart)
router.delete('/deletefromcart/:id',appController.deleteFromCart)
router.get('/getsales', appController.getSales);
router.post('/addsales',appController.addSales)

module.exports = router