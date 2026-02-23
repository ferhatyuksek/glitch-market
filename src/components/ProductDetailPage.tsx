import type { FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProductById } from '../api/products';
import { getGlitchReport, getGlitchScore, normalizeProduct } from '../utils/normalize.ts';

const ProductDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div>Ürün bulunamadı.</div>;
  }

  const raw = getProductById(id);

  if (!raw) {
    return <div>Ürün bulunamadı.</div>;
  }

  const product = normalizeProduct(raw);
  const glitchScore = getGlitchScore(raw);
  const glitchReport = getGlitchReport(raw);

  return (
    <div style={{ padding: '1.5rem' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '1rem' }}>
        ← Listeye dön
      </Link>

      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
        {product.name}
      </h1>

      <p><strong>Fiyat:</strong> {product.price} TL</p>
      <p><strong>Stok:</strong> {product.stock}</p>
      <p><strong>Kategori:</strong> {product.category}</p>
      <p><strong>Glitch Skoru:</strong> {glitchScore}</p>

      {glitchReport.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <strong>Glitch Raporu:</strong>
          <ul>
            {glitchReport.map((item: string) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {product.description && (
        <p style={{ marginTop: '1rem' }}>
          <strong>Açıklama:</strong> {product.description}
        </p>
      )}
    </div>
  );
};

export default ProductDetailPage;

