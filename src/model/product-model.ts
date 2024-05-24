import { ProductInterface } from "./Product";

export type productResponse = {
  _id: string;
  name: string;
  slug: string;
  image: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  countInStock: number;
  rating: number;
  numReviews: number;
};

export type getProductRequest = {
  slug: string;
};

export const toProductResponse = (product: ProductInterface): productResponse => {
  return {
    _id: product._id,
    name: product.name,
    slug: product.slug,
    image: product.image,
    brand: product.brand,
    category: product.category,
    description: product.description,
    price: product.price,
    countInStock: product.countInStock,
    rating: product.rating,
    numReviews: product.numReviews,
  };
};
