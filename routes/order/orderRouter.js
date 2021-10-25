var express = requrie("express");
var router = express.Router();
var jwtMiddleware = require('../users/lib/auth')
const {getAllOrders, createOrder, delteOrderById, updateOrderByID} = require('./controller/orderController')


router.get("/", jwtMiddleware, getAllOrders);



router.post('/create-order', jwtMiddleware, createOrder)

router.delete('/delete-order-by-id/:id', jwtMiddleware, delteOrderById)

router.put('/update-order-by-id/:id', jwtMiddleware, updateOrderByID)
module.exports = router;