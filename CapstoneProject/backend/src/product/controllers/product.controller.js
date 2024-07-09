// Please don't change the pre-written code
// Import the necessary modules here

import { ErrorHandler } from "../../../utils/errorHandler.js";
import {
  addNewProductRepo,
  deleProductRepo,
  findProductRepo,
  getAllProductsRepo,
  getProductDetailsRepo,
  getTotalCountsOfProduct,
  updateProductRepo,
} from "../model/product.repository.js";
import ProductModel from "../model/product.schema.js";

export const addNewProduct = async (req, res, next) => {
  try {
    const product = await addNewProductRepo({
      ...req.body,
      createdBy: req.user._id,
    });
    if (product) {
      res.status(201).json({ success: true, product });
    } else {
      return next(new ErrorHandler(400, "some error occured!"));
    }
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    // Extract query parameters
    const { keyword, category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

    // Build search criteria
    let searchCriteria = {};

    if (keyword) {
      searchCriteria.name = { $regex: keyword, $options: "i" }; // Case-insensitive search
    }

    if (category) {
      searchCriteria.category = category;
    }

    if (minPrice) {
      searchCriteria.price = { ...searchCriteria.price, $gte: minPrice };
    }

    if (maxPrice) {
      searchCriteria.price = { ...searchCriteria.price, $lte: maxPrice };
    }

    // Pagination calculation
    const skip = (page - 1) * limit;

    // Fetch products from database
    const products = await ProductModel.find(searchCriteria)
      .limit(limit)
      .skip(skip);

    // Get total count of products for pagination
    const totalProducts = await ProductModel.countDocuments(searchCriteria);

    res.status(200).json({
      success: true,
      products,
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
    });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
  // Implement the functionality for search, filter and pagination this function.
};

export const updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await updateProductRepo(req.params.id, req.body);
    if (updatedProduct) {
      res.status(200).json({ success: true, updatedProduct });
    } else {
      return next(new ErrorHandler(400, "Product not found!"));
    }
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const deletedProduct = await deleProductRepo(req.params.id);
    if (deletedProduct) {
      res.status(200).json({ success: true, deletedProduct });
    } else {
      return next(new ErrorHandler(400, "Product not found!"));
    }
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const getProductDetails = async (req, res, next) => {
  try {
    const productDetails = await getProductDetailsRepo(req.params.id);
    if (productDetails) {
      res.status(200).json({ success: true, productDetails });
    } else {
      return next(new ErrorHandler(400, "Product not found!"));
    }
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const rateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const { rating, comment } = req.body;
    const user = req.user._id;
    const name = req.user.name;
    const review = {
      user,
      name,
      rating: Number(rating),
      comment,
    };
    if (!rating) {
      return next(new ErrorHandler(400, "rating can't be empty"));
    }
    const product = await findProductRepo(productId);
    if (!product) {
      return next(new ErrorHandler(400, "Product not found!"));
    }
    const findRevieweIndex = product.reviews.findIndex((rev) => {
      return rev.user.toString() === user.toString();
    });
    if (findRevieweIndex >= 0) {
      product.reviews.splice(findRevieweIndex, 1, review);
    } else {
      product.reviews.push(review);
    }
    let avgRating = 0;
    product.reviews.forEach((rev) => {
      avgRating += rev.rating;
    });
    const updatedRatingOfProduct = avgRating / product.reviews.length;
    product.rating = updatedRatingOfProduct;
    await product.save({ validateBeforeSave: false });
    res
      .status(201)
      .json({ success: true, msg: "thx for rating the product", product });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};

export const getAllReviewsOfAProduct = async (req, res, next) => {
  try {
    const product = await findProductRepo(req.params.id);
    if (!product) {
      return next(new ErrorHandler(400, "Product not found!"));
    }
    res.status(200).json({ success: true, reviews: product.reviews });
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const deleteReview = async (req, res, next) => {
  // Insert the essential code into this controller wherever necessary to resolve issues related to removing reviews and updating product ratings.
  // try {
  //   const { productId, reviewId } = req.query;
  //   if (!productId || !reviewId) {
  //     return next(
  //       new ErrorHandler(
  //         400,
  //         "pls provide productId and reviewId as query params"
  //       )
  //     );
  //   }
  //   const product = await findProductRepo(productId);
  //   if (!product) {
  //     return next(new ErrorHandler(400, "Product not found!"));
  //   }
  //   const reviews = product.reviews;

  //   const isReviewExistIndex = reviews.findIndex((rev) => {
  //     return rev._id.toString() === reviewId.toString();
  //   });
  //   if (isReviewExistIndex < 0) {
  //     return next(new ErrorHandler(400, "review doesn't exist"));
  //   }

  //   const reviewToBeDeleted = reviews[isReviewExistIndex];
  //   reviews.splice(isReviewExistIndex, 1);

  //   await product.save({ validateBeforeSave: false });
  //   res.status(200).json({
  //     success: true,
  //     msg: "review deleted successfully",
  //     deletedReview: reviewToBeDeleted,
  //     product,
  //   });
  // } catch (error) {
  //   return next(new ErrorHandler(500, error));
  // }
  try {
    const { productId, reviewId } = req.query;
    const userId = req.user._id;

    if (!productId || !reviewId) {
      return next(
        new ErrorHandler(
          400,
          "Please provide productId and reviewId as query params"
        )
      );
    }

    const product = await findProductRepo(productId);
    if (!product) {
      return next(new ErrorHandler(400, "Product not found!"));
    }

    const reviews = product.reviews;
    const reviewIndex = reviews.findIndex((rev) => rev._id.toString() === reviewId);

    if (reviewIndex < 0) {
      return next(new ErrorHandler(400, "Review doesn't exist"));
    }

    const reviewToBeDeleted = reviews[reviewIndex];

    // Ensure that only the user who created the review can delete it
    if (reviewToBeDeleted.user.toString() !== userId.toString()) {
      return next(new ErrorHandler(403, "You can only delete your own review"));
    }

    reviews.splice(reviewIndex, 1);

    // Recalculate the average rating after the review is deleted
    let avgRating = 0;
    reviews.forEach((rev) => {
      avgRating += rev.rating;
    });
    const updatedRatingOfProduct = reviews.length === 0 ? 0 : avgRating / reviews.length;
    product.rating = updatedRatingOfProduct;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      msg: "Review deleted successfully",
      deletedReview: reviewToBeDeleted,
      product,
    });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};
