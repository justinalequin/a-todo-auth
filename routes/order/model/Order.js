const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({

    orderName: {
        type: String,
    },

    orderAmount: {
        type: String,
    },

    orderItem: {
        type: Array,
    },

    orderOwner: {
        tpe: mongoose.Schema.ObjectId,
        ref: "user"
    },
   

},
 {
        timestamps: true,
    })

module.exports = mongoose.model("order", OrderSchema)