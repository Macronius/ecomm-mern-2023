import asyncHandler from "../middleware/asyncHandler.js";
import ProductModel from "../models/productModel.js";

// @desc fetch all products
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
  //
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;

  // keyword for search functionality
  const keyword = req.query.keyword 
    ? {name: {
      $regex: req.query.keyword,  // want to match if the keyword is anywhere in the title
      $options: 'i',  // case insensitive
    }} 
    : {}

  // get total number of pages, consider if keyword
  const count = await ProductModel.countDocuments({...keyword});  // Q-28

  // get enough products to fill a particular page, consider if keyword
  const products = await ProductModel.find({...keyword}).limit(pageSize).skip((page - 1) * pageSize);

  // return object: products (only per page), page (current page number), pages (number of pages)
  res.json({products, page, pages: Math.ceil(count/pageSize)});
});

// @desc fetch single product by id
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await ProductModel.findById(req.params.id);
  //
  if (product) {
    return res.json(product);
  } else {
    res.status(404);
    throw new Error("Status Code 404: Product not found");
  }
});

// @desc    create a post
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new ProductModel({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample brand",
    category: "Sample category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
  });
  //
  const createdProduct = await product.save();
  //
  res.status(201).json(createdProduct);
});

// @desc    update a prodoct (note: this is my store, not anyone's store)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  // destructure updated product info from form in request
  const { name, price, description, image, brand, category, countInStock } =
    req.body;
  // find product from model by product id in request parameters
  const product = await ProductModel.findById(req.params.id);
  // overwrite product with new info
  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;
    // save to new product object
    const updatedProduct = await product.save(); // Q-24
    // response
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    delete a prodoct (note: this is my store, not anyone's store)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await ProductModel.findById(req.params.id);
  //
  if (product) {
    await ProductModel.deleteOne({ _id: product._id });
    res.status(200).json({ message: "Product deleted" });
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

// @desc    create a new product review
// @route   POST  /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  //
  const { rating, comment } = req.body;
  //
  const product = await ProductModel.findById(req.params.id);
  if (product) {
    // check for user already reviewed (user cannot review same product twice)
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );
    //
    if (alreadyReviewed) {
      res.status(400); // client error
      throw new Error("You have already reviewed this product");
    }
    // create new review object and push to reviews array
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment: comment,
    };
    product.reviews.push(review);
    // update numReviews count
    product.numReviews = product.reviews.length;
    // recalculate rating total: cummulative total / total number
    product.reviews.reduce((accumulator, review) => accumulator + review.rating, 0) / product.reviews.length;
    // save/update product
    await product.save();
    res.status(201).json({ message: "Review added" }); //201 = something was created
  } else {
    res.status(404); // not found
    throw new Error("Product resource not found");
  }
});

// @desc get top-rated products
// @route GET /api/products/top
// @access Public
const getTopProducts = asyncHandler(async (req, res) => {
  // check products, sort increasing order, take from the end, limit 3
  const products = await ProductModel.find({}).sort({rating: -1}).limit(3);
  // 
  res.status(200).json(products);
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
};
