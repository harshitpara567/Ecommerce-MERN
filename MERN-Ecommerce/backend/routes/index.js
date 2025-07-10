const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) { 
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });

const upload = multer({storage: storage});  

const authToken = require("../middleware/authToken");
const userSignUPController = require("../controller/userSignUp");
const userSignInController = require("../controller/userSignIn");
const userDetailsController = require("../controller/userDetails");
const productController = require("../controller/productController");
const cartController = require("../controller/cartController");
const {createOrder} = require("../controller/paymentController");
const orderController = require("../controller/orderController")
/**
 * @swagger
 * components:
 *   schemas:
 *     SignUpUser:
 *       type: object
 *       required: [name, password]
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: john@example.com
 *         phoneNumber:
 *           type: string
 *           example: "9876543210"
 *         password:
 *           type: string
 *           example: mysecurepassword
 *     
 *     SignInUser:
 *       type: object
 *       required: [identifier, password]
 *       properties:
 *         identifier:
 *           type: string
 *           example: john@example.com
 *         password:
 *           type: string
 *           example: mysecurepassword
 *     ProfilePictureUpdate:
 *       type: object
 *       properties:
 *         profilePicture:
 *           type: string
 *     CartItem:
 *       type: object
 *       required: [userId, productId, quantity]
 *       properties:
 *         userId:
 *           type: string
 *         productId:
 *           type: string
 *         quantity:
 *           type: number
 *     CartRemove:
 *       type: object
 *       required: [userId, productId]
 *       properties:
 *         userId:
 *           type: string
 *         productId:
 *           type: string
 *     Product:
 *       type: object
 *       required: [name, price, description, image, category]
 *       properties:
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         description:
 *           type: string
 *         image:
 *           type: string
 *         category:
 *           type: string
 */

/**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: Register a new user (email or phone number)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignUpUser'
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: User already exists or bad input
 */
router.post("/signup", upload.single('profilePic'),userSignUPController);

/**
 * @swagger
 * /api/signin:
 *   post:
 *     summary: Login using email or phone number
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignInUser'
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Invalid credentials
 */
router.post("/signin", userSignInController);

/**
 * @swagger
 * /api/user-details/{userId}:
 *   get:
 *     summary: Get details of a specific user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details returned
 */
router.get("/user-details/:userId", userDetailsController.getUserDetails);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/users", userDetailsController.getAllUsers);

/**
 * @swagger
 * /api/user-details/{userId}/profile-picture:
 *   put:
 *     summary: Update profile picture of a user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfilePictureUpdate'
 *     responses:
 *       200:
 *         description: Profile picture updated
 */
router.put("/user-details/:userId/profile-picture", upload.single('profilePic'), userDetailsController.updateProfilePicture);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 */
router.get("/products", productController.getAllProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created
 */
router.post("/products", productController.createProduct);


/**
 * @swagger
 * /api/products/{productId}:
 *   get:
 *     summary: Get details of a single product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */

router.get("/products/:productId", productController.getSingleProduct);


/**
 * @swagger
 * /api/cart/{userId}:
 *   get:
 *     summary: Get cart for a specific user
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User cart returned
 */
router.get("/cart/:userId", cartController.getCart);

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartItem'
 *     responses:
 *       200:
 *         description: Item added to cart
 */
router.post("/cart/add", cartController.addToCart);

/**
 * @swagger
 * /api/cart/update:
 *   put:
 *     summary: Update quantity of item in cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartItem'
 *     responses:
 *       200:
 *         description: Item quantity updated
 */
router.put("/cart/update", cartController.updateCartItem);

/**
 * @swagger
 * /api/cart/remove/{userId}/{productId}:
 *   delete:
 *     summary: Remove an item from a user's cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the product to remove
 *     responses:
 *       200:
 *         description: Product removed from cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product removed from cart
 *                 cart:
 *                   $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Failed to remove product
 */

router.delete("/cart/remove/:userId/:productId", cartController.removeFromCart);

/**
 * @swagger
 * /api/cart/clear/{userId}:
 *   delete:
 *     summary: Clear cart for a user
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart cleared
 */
router.delete("/cart/clear/:userId", cartController.clearCart);


router.post("/payment/create-order", createOrder);
router.get("/orders/:orderId",orderController.getOrderDetails);
router.post('/orders/cod', orderController.createCODOrder);
module.exports = router;
