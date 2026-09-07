import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  Product,
  ProductListResponse,
  CreateProductPayload,
  UpdateProductPayload,
} from "../types/product.types";

export interface ProductsApiQueryParams {
  limit?: number;
  skip?: number;
  q?: string;
  category?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

export const productsApi = {
  getProducts: async (
    params: ProductsApiQueryParams = {},
  ): Promise<ProductListResponse> => {
    let url = API_ENDPOINTS.PRODUCTS.LIST;
    const queryParams: Record<string, any> = {};

    if (params.limit !== undefined) queryParams.limit = params.limit;
    if (params.skip !== undefined) queryParams.skip = params.skip;

    if (params.q && params.q.trim() !== "") {
      url = API_ENDPOINTS.PRODUCTS.SEARCH;
      queryParams.q = params.q.trim();
    } else if (params.category && params.category !== "all") {
      url = `/products/category/${encodeURIComponent(params.category)}`;
    }

    if (params.sortBy) {
      queryParams.sortBy = params.sortBy;
      queryParams.order = params.order || "asc";
    }

    const response = await apiClient.get<ProductListResponse>(url, {
      params: queryParams,
    });
    return response.data;
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await apiClient.get<Product>(
      API_ENDPOINTS.PRODUCTS.BY_ID(id),
    );
    return response.data;
  },

  createProduct: async (payload: CreateProductPayload): Promise<Product> => {
    const response = await apiClient.post<Product>(
      API_ENDPOINTS.PRODUCTS.ADD,
      payload,
    );
    return response.data;
  },

  updateProduct: async (
    id: number,
    payload: UpdateProductPayload,
  ): Promise<Product> => {
    const response = await apiClient.put<Product>(
      API_ENDPOINTS.PRODUCTS.UPDATE(id),
      payload,
    );
    return response.data;
  },

  deleteProduct: async (
    id: number,
  ): Promise<{ id: number; isDeleted: boolean; deletedOn: string }> => {
    const response = await apiClient.delete(API_ENDPOINTS.PRODUCTS.DELETE(id));
    return response.data;
  },
};
