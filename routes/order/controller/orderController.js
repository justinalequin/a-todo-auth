const {isAlpha, isInt} = require("validator")

const Order = require("../model/Order")
const User = require("../../users/model/User");
const errorHandler = require("../../utils/errorHandler/errorHandler");

async function getAllOrders(req, res){
    let foundAllOrders = await Order.find({});

    res.json({message: "success", payload: foundAllOrders})
}

async function createOrder(req, res){
    try {
    const { orderName, orderAmount, orderItem} = req.body;

    let errObj = {}
    
    if (!isAlpha(orderName)){
        errObj.orderName = "Alphabet only"
    }
    
    if (!isInt(orderAmount)){
        errObj.orderName = "Only Numbers"
    }
    
    if (Object.keys(errObj).length > 0){
        return res.status(500).json({
            message: "error",
            error: errObj,
        });
    }

    const decodedData = res.locals
    let foundUser = User.findOne({email: decodedData.email})
    
    const createdOrder = new Order({
        orderName,
        orderAmount,
        orderItem,
        orderOwner: foundUser._id,
    })
    let savedOrder = await createdOrder.save();


    foundUser.orderHistory.push(savedOrder._id);

    await foundUser.save();

    res.json({message: "success", createdOrder})

} catch (e){
    res.status(500).json(errorHandler(e));
}
}

async function delteOrderById(req, res){
    try {

        let deletedOrder = await Order.findByIdAndRemove(req.params.id);
    
        const decodedData = res.locals.decodedData;
    
        let foundUser = await User.findOne({ email: decodedData.email })
    
        let userOrderHistoryArray = foundUser.orderHistory;
    
        let filteredOrderHistoryArray = userOrderHistoryArray.filter( 
            (item) => item._id.toString() !== req.params.id);
    
            foundUser.orderHistory = filteredOrderHistoryArray;;
    
            await foundUser.save();
    
            res.json({
                message: "success",
                deleted: deletedOrder,
            })
    
    } catch (e) {
        res.status(500).json(errorHandler(e));
    }
}

async function updateOrderByID(req, res){
    try {

        let foundOrder = await Order.findById(req.params.id);

        if(!foundOrder){
            res.status(404).json({message: "failure", error: "Order not found"})
        } else {

        let updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

res.json({message: "success", payload: updatedOrder})
        }


    } catch (e){
        res.status(500).json(errorHandler(e));
    }
}

module.exports = {
    getAllOrders,
    createOrder,
    delteOrderById,
    updateOrderByID,
}
