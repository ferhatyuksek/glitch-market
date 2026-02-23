import type { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProductById } from '../api/products';
import type { RawProduct } from '../types/product.ts';
import { getGlitchReport, normalizeProduct } from '../utils/normalize.ts';

const ProductDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery<RawProduct | undefined>({
    queryKey: ['product', id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return undefined;
      return getProductById(id);
    },
  });

  const handleBack = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div style={{ padding: '1.5rem' }}>
        <button type="button" onClick={handleBack}>
          ← Listeye Dön
        </button>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div style={{ padding: '1.5rem' }}>
        <button type="button" onClick={handleBack}>
          ← Listeye Dön
        </button>
        <p>Ürün bulunamadı.</p>
      </div>
    );
  }

  const normalized = normalizeProduct(data);
  const glitchReport = getGlitchReport(data);

  return (
    <div style={{ padding: '1.5rem' }}>
      <button
        type="button"
        onClick={handleBack}
        style={{
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          border: '1px solid #d1d5db',
          backgroundColor: '#111827',
          color: '#ffffff',
          cursor: 'pointer',
          marginBottom: '1rem',
        }}
      >
        ← Listeye Dön
      </button>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        {/* Sol taraf: Raw JSON görünümü */}
        <div
          style={{
            backgroundColor: '#1a1a1a',
            color: '#00ff00',
            padding: '1rem',
            borderRadius: '0.75rem',
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            overflowX: 'auto',
          }}
        >
          <pre style={{ margin: 0 }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>

        {/* Sağ taraf: Normalize edilmiş görünüm */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.75rem',
            border: '1px solid #e5e7eb',
            boxShadow:
              '0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.1)',
            padding: '1.25rem',
          }}
        >
          <h2
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              marginBottom: '0.75rem',
            }}
          >
            Normalize Edilmiş Ürün
          </h2>
          <p><strong>İsim:</strong> {normalized.name}</p>
          <p><strong>Fiyat:</strong> {normalized.price} TL</p>
          <p><strong>Stok:</strong> {normalized.stock}</p>
          <p><strong>Kategori:</strong> {normalized.category}</p>
        </div>
      </div>

      <div
        style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.75rem',
          padding: '1rem',
        }}
      >
        <h3
          style={{
            fontSize: '0.95rem',
            fontWeight: 600,
            color: '#b91c1c',
            marginBottom: '0.5rem',
          }}
        >
          Glitch Analiz Raporu
        </h3>
        {glitchReport.length === 0 ? (
          <p style={{ fontSize: '0.85rem' }}>Herhangi bir sorun tespit edilmedi.</p>
        ) : (
          <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.85rem' }}>
            {glitchReport.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;

