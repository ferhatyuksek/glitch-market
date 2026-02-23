import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../api/products';
import type { RawProduct } from '../types/product';
import ProductRow from './ProductRow';
import { PRODUCT_CATEGORIES } from '../utils/normalize';
import '../styles/Products.css';

function ProductsTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const { data: products, isLoading, isError } = useQuery<RawProduct[]>({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const cat = Array.isArray(p.category) ? p.category[0] : p.category;
      const categoryMatch = !selectedCategory || cat?.toLowerCase() === selectedCategory.toLowerCase();
      return nameMatch && categoryMatch;
    });
  }, [products, searchTerm, selectedCategory]);

  if (isLoading) return <div className="loading-state">Yükleniyor...</div>;
  if (isError) return <div className="error-state">Hata oluştu!</div>;

  return (
    <div className="products-container">
      <div className="products-filter-panel">
        <input
          type="text"
          placeholder="İsim ile ara..."
          className="products-filter-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="products-filter-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Tüm Kategoriler</option>
          {PRODUCT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="products-card">
        <table className="products-table">
          <thead className="products-thead">
            <tr className="products-head-row">
              <th className="products-th">İsim</th>
              <th className="products-th">Fiyat</th>
              <th className="products-th">Stok</th>
              <th className="products-th">Kategori</th>
              <th className="products-th products-th--right">Glitch Skoru</th>
            </tr>
          </thead>
          <tbody className="products-tbody">
            {filteredProducts.map((product) => (
              <ProductRow key={product.id} product={product} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductsTable;