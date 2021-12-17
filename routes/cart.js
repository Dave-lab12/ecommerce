const router = require("express").Router();
const CryptoJS = require("crypto-js");
const Cart = require("../models/Cart");
const { random } = require('../utils/generateUniqueId')

const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} = require("./verifyToken");

//create cart

router.post('/', verifyToken, async (req, res) => {
    // todo sanitize all incoming data
    const newCart = new Cart(req.body)

    try {
        const savedCart = await newCart.save()
        res.status(200).json(savedCart)
    } catch (error) {
        res.status(500).json(error)
    }
})


router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {

    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedCart);
    } catch (err) {
        res.status(500).json(err);
    }
});

//delete

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart had been deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});

//get user cart
//todo remove all the err with appropriate messages

router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: userId.params.id });
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get all Cart

router.get("/", verifyTokenAndAdmin, async (req, res) => {

    try {

        const carts = await Cart.find()
        res.status(200).json(carts);
    } catch (err) {
        res.status(500).json(err);
    }
});




module.exports = router;
