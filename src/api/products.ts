import rawProducts from '../data/products.json';
import type { RawProduct } from '../types/product.ts';

let products: RawProduct[] = rawProducts;

export function getProducts(): RawProduct[] {
  return products;
}

export function getProductById(id: string): RawProduct | undefined {
  return products.find((product) => product.id === id);
}

export function updateProduct(
  id: string,
  updates: Partial<RawProduct>,
): RawProduct | undefined {
  const index = products.findIndex((product) => product.id === id);
  if (index === -1) return undefined;

  const updatedRaw: RawProduct = {
    ...products[index],
    ...updates,
  };

  products[index] = updatedRaw;
  return updatedRaw;
}

