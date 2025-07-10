const Product = require('../models/product');

// Fetch all products with search capabilities
const getAllProducts = async (req, res) => {
  try {
    const { q } = req.query; // Get the search query 'q' from the URL (e.g., /api/products?q=query)
    let query = {}; // Initialize an empty query object

    if (q) {
      // If a search query exists, create a case-insensitive regular expression
      const searchRegex = new RegExp(q, 'i');

      // Construct a query that searches for the 'q' term in either 'name' or 'category' fields
      query = {
        $or: [
          { name: searchRegex },    // Search by product name
          { category: searchRegex } // Search by product category
        ]
      };
    }

    // Find products based on the constructed query (or all products if no 'q' is provided)
    const products = await Product.find(query);

    res.json({ success: true, data: products });
  } catch (err) {
    console.error("Error fetching products:", err); // Log the error for debugging
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
};

// Add a new product
const createProduct = async (req, res) => {
  const { name, description, price, image, category } = req.body;

  try {
    // Basic validation to ensure required fields are present
    if (!name || !description || !price || !image || !category) {
      return res.status(400).json({
        success: false,
        message: 'All product fields are required: name, description, price, image, category'
      });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      image,
      category,
    });

    await newProduct.save();
    res.status(201).json({ success: true, message: 'Product added successfully', data: newProduct });
  } catch (err) {
    console.error("Error creating product:", err); // Log the error for debugging
    res.status(500).json({ success: false, message: 'Failed to add product' });
  }
};

// Get a single product by ID
const getSingleProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, data: product }); // Return success: true and data for consistency
  } catch (err) {
    console.error("Error fetching single product:", err); // Log the error for debugging
    res.status(500).json({ success: false, message: "Something went wrong fetching the product" });
  }
};

// Export functions
module.exports = {
  getAllProducts,
  createProduct,
  getSingleProduct
};