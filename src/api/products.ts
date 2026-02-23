import rawProducts from '../data/products.json';
import type { Product, RawProduct } from '../types/product';
import { getGlitchReport, getGlitchScore, normalizeProduct } from '../utils/normalize';


let products: RawProduct[] = rawProducts.map((product) => ({
  ...product,
  category: Array.isArray(product.category) ? product.category[0] ?? '' : product.category,
}));


export interface ProductWithGlitchMeta extends Product {
  glitchScore: number;
  glitchReport: string[];
}

export function getProducts(): ProductWithGlitchMeta[] {
  return products.map((raw) => {
    const normalized = normalizeProduct(raw);
    const glitchScore = getGlitchScore(raw);
    const glitchReport = getGlitchReport(raw);
    return {
      ...normalized,glitchScore,glitchReport,
    };
  });
}

export function getProductById(id: string): ProductWithGlitchMeta | undefined {
  const raw = products.find((product) => product.id === id);
  if (!raw) return undefined;

  const normalized = normalizeProduct(raw);
  const glitchScore = getGlitchScore(raw);
  const glitchReport = getGlitchReport(raw);

  return {
    ...normalized,
    glitchScore,
    glitchReport,
  };
}

export function updateProduct(
  id: string,
  updates: Partial<RawProduct>,
): ProductWithGlitchMeta | undefined {
  const index = products.findIndex((product) => product.id === id);
  if (index === -1) return undefined;

  const updatedRaw: RawProduct = {
    ...products[index],
    ...updates,
  };

  products[index] = updatedRaw;

  const normalized = normalizeProduct(updatedRaw);
  const glitchScore = getGlitchScore(updatedRaw);
  const glitchReport = getGlitchReport(updatedRaw);

  return {
    ...normalized,
    glitchScore,
    glitchReport,
  };
}

