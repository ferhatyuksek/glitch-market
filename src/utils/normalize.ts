import type { Product, ProductCategory, RawProduct } from '../types/product.ts';

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'elektronik',
  'kitap',
  'giyim',
  'ev',
  'oyuncak',
  'mobilya',
  'aksesuar',
];

export function normalizePrice(rawPrice: string): number {
  if (!rawPrice) return 0;
  let cleaned = rawPrice.replace(/,/g, '.');
  cleaned = cleaned.replace(/[^0-9.-]/g, '');
  if (!cleaned) return 0;
  const parsed = parseFloat(cleaned);
  if (Number.isNaN(parsed)) {
    return 0;
  }
  return parsed;
}

export function normalizeStock(rawStock: any): number {
  const stockAsNumber = Number(rawStock);
  if (isNaN(stockAsNumber)) return 0;
  return stockAsNumber < 0 ? 0 : stockAsNumber;
}

export function calculateTypoDistance(a: string, b: string): number {
  const aLen = a.length;
  const bLen = b.length;
  if (aLen === 0) return bLen;
  if (bLen === 0) return aLen;

  const dp: number[][] = Array.from({ length: aLen + 1 }, () =>
    new Array(bLen + 1).fill(0),
  );

  for (let i = 0; i <= aLen; i += 1) dp[i][0] = i;
  for (let j = 0; j <= bLen; j += 1) dp[0][j] = j;

  for (let i = 1; i <= aLen; i += 1) {
    for (let j = 1; j <= bLen; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      );
    }
  }

  return dp[aLen][bLen];
}

export function normalizeCategory(rawCategory: string): ProductCategory {
  if (!rawCategory) {
    return 'elektronik';
  }

  const trimmed = rawCategory.trim().toLowerCase();
  const directMatch = PRODUCT_CATEGORIES.find(
    (c) => c.toLowerCase() === trimmed,
  );
  if (directMatch) {
    return directMatch;
  }

  const normalizeString = (value: string) =>
    value.toLowerCase().replace(/[^a-z]/g, '');

  const target = normalizeString(rawCategory);
  if (!target) {
    return 'elektronik';
  }

  let best: ProductCategory = 'elektronik';
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const category of PRODUCT_CATEGORIES) {
    const dist = calculateTypoDistance(normalizeString(category), target);
    if (dist < bestDistance) {
      bestDistance = dist;
      best = category;
    }
  }

  return best;
}

export function cleanName(rawName: string): string {
  if (!rawName) return '';
  const cleaned = rawName
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned;
}

export function normalizeProduct(raw: RawProduct): Product {
  return {
    id: raw.id,
    name: cleanName(raw.name),
    price: normalizePrice(raw.price),
    stock: normalizeStock(raw.stock),
    category: Array.isArray(raw.category)
      ? normalizeCategory(raw.category[0])
      : normalizeCategory(raw.category),
    description: raw.description,
  };
}

export function getGlitchScore(raw: RawProduct): number {
  let score = 0;

  const normalizedPrice = normalizePrice(raw.price);
  const cleanedPrice = raw.price
    ? raw.price.replace(/,/g, '.').replace(/[^0-9.-]/g, '')
    : '';
  if (!cleanedPrice || Number.isNaN(normalizedPrice)) {
    score += 30;
  }

  if (typeof raw.stock === 'number' && raw.stock < 0) {
    score += 20;
  }

  let trimmedCategory: string | undefined;
  if (typeof raw.category === 'string') {
    trimmedCategory = raw.category.trim().toLowerCase();
  } else if (
    Array.isArray(raw.category) &&
    raw.category.length > 0 &&
    typeof raw.category[0] === 'string'
  ) {
    trimmedCategory = raw.category[0].trim().toLowerCase();
  } else {
    trimmedCategory = undefined;
  }
  const categoryValid = PRODUCT_CATEGORIES.some(
    (c) => c.toLowerCase() === trimmedCategory,
  );
  if (!categoryValid) {
    score += 10;
  }

  const cleanedName = cleanName(raw.name);
  if (!cleanedName) {
    score += 20;
  }

  if (score > 100) score = 100;
  if (score < 0) score = 0;
  return score;
}

export function getGlitchReport(raw: RawProduct): string[] {
  const report: string[] = [];

  const normalizedPrice = normalizePrice(raw.price);
  const cleanedPrice = raw.price
    ? raw.price.replace(/,/g, '.').replace(/[^0-9.-]/g, '')
    : '';
  if (!cleanedPrice || Number.isNaN(normalizedPrice)) {
    report.push('Fiyat formatı düzeltildi');
  }

  if (typeof raw.stock === 'number' && raw.stock < 0) {
    report.push('Negatif stok düzeltildi');
  }

  let trimmedCategory: string | undefined;
  if (typeof raw.category === 'string') {
    trimmedCategory = raw.category.trim().toLowerCase();
  } else if (
    Array.isArray(raw.category) &&
    raw.category.length > 0 &&
    typeof raw.category[0] === 'string'
  ) {
    trimmedCategory = raw.category[0].trim().toLowerCase();
  } else {
    trimmedCategory = undefined;
  }
  const categoryValid = PRODUCT_CATEGORIES.some(
    (c) => c.toLowerCase() === trimmedCategory,
  );
  if (!categoryValid) {
    report.push('Kategori değeri düzeltildi');
  }

  const cleanedName = cleanName(raw.name);
  if (!cleanedName) {
    report.push('Ürün adı boş bırakılmış');
  }

  return report;
}

