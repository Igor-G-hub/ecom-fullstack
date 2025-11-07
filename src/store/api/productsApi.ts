import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Product, ProductCategory } from '@prisma/client';

export interface ProductInput {
  title: string;
  description: string;
  image: string;
  category: ProductCategory;
  price: number;
  availability: boolean;
}

export interface ProductResponse extends Product {}

export interface ProductsResponse {
  products: ProductResponse[];
  total: number;
}

export interface ProductFilters {
  search?: string;
  category?: ProductCategory[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price_asc' | 'price_desc';
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${API_BASE_URL}/api` }),
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, ProductFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.category?.length) {
          filters.category.forEach((cat) => params.append('category', cat));
        }
        if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
        if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        
        const queryString = params.toString();
        return queryString ? `/products?${queryString}` : '/products';
      },
      providesTags: ['Product'],
    }),
    getProductById: builder.query<ProductResponse, number>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    createProduct: builder.mutation<ProductResponse, ProductInput>({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation<ProductResponse, { id: number; data: Partial<ProductInput> }>({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }, 'Product'],
    }),
    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;

export { productsApi };

