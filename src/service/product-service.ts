import { ResponseError } from "../error/response-error";
import Product from "../model/Product";
import { getProductRequest, productResponse, toProductResponse } from "../model/product-model";
import { ProductValidation } from "../validation/product-validation";
import { Validation } from "../validation/validation";

export class ProductService {
  public static async list(): Promise<Array<productResponse>> {
    const products = await Product.find({});

    return products.map((product) => toProductResponse(product));
  }

  public static async category(): Promise<Array<string>> {
    const categories = await Product.find({}).distinct("category");

    return categories.map((category) => category);
  }

  public static async get(request: getProductRequest): Promise<productResponse> {
    const slug = Validation.validate(ProductValidation.GET, request.slug);

    const product = await Product.findOne({ slug: slug });

    if (!product) {
      throw new ResponseError(404, "Product is not found");
    }

    return toProductResponse(product);
  }
}
