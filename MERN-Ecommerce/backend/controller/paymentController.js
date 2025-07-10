const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: "rzp_test_nMCrdCBZT6Cxwn",
    key_secret: "BWOnBN8avebwbZfp4oFKqJUg",
});

exports.createOrder = async (req, res) => {
    try {
        const options = {
            amount: req.body.amount , // amount in smallest currency unit
            currency: "INR",
            receipt: "order_rcptid_11"
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        console.error("Order creation failed:", error);
        res.status(500).json({ message: "Something went wrong while creating order" });
    }
};
