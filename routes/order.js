const router = require("express").Router();
const CryptoJS = require("crypto-js");
const Order = require("../models/Order");
const { random } = require('../utils/generateUniqueId')

const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} = require("./verifyToken");

//create order

router.post('/', verifyToken, async (req, res) => {
    // todo sanitize all incoming data
    const newOrder = new Order(req.body)

    try {
        const savedOrder = await newOrder.save()
        res.status(200).json(savedOrder)
    } catch (error) {
        res.status(500).json(error)
    }
})


router.put("/:id", verifyTokenAndAdmin, async (req, res) => {

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

//delete

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order had been deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});

//get user cart
//todo remove all the err with appropriate messages

router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const orders = await Order.findOne({ userId: userId.params.id });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get all Cart

router.get("/", verifyTokenAndAdmin, async (req, res) => {

    try {

        const orders = await Order.find()
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get Monthly Income

router.get('/income', verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
    const prevMonth = new Date(date.setMonth(lastMonth.getMonth() - 1))

    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: prevMonth } } },
            {
                $project: {
                    month: { $month: '$createdAt' },
                    sales: '$amount'
                },
            },
            {
                $group: {
                    _id: '$month',
                    total: { $sum: '$sales' }
                }
            },

        ])
        res.status(200).json(income)
    } catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router;
