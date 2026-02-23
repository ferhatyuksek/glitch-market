import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RawProduct } from '../types/product.ts';
import { getGlitchScore, normalizeProduct } from '../utils/normalize';

interface ProductRowProps {
  product: RawProduct;
}

const ProductRow: FC<ProductRowProps> = ({ product }) => {
  const navigate = useNavigate();
  const normalized = normalizeProduct(product);
  const glitchScore = getGlitchScore(product);

  const severityClass =
    glitchScore >= 80
      ? 'row-danger'
      : glitchScore >= 50
        ? 'row-warning'
        : 'row-normal';

  const glitchScoreClass =
    glitchScore >= 50
      ? 'product-glitch-score--warn'
      : 'product-glitch-score--ok';

  return (
    <tr className={`product-row ${severityClass}`}>
      <td className="product-cell product-cell--name">
        <span className="product-name">{normalized.name}</span>
      </td>
      <td className="product-cell">
        {normalized.price} TL
      </td>
      <td className="product-cell product-cell--stock">
        {normalized.stock}
      </td>
      <td className="product-cell product-cell--category">
        <span className="product-category-pill">
          {normalized.category}
        </span>
      </td>
      <td className="product-cell product-cell--glitch">
        <span className={glitchScoreClass}>
          {glitchScore}
        </span>
      </td>
      <td className="product-cell">
        <div className="product-actions">
          <button
            type="button"
            className="product-action-btn product-action-btn--primary"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product.id}`);
            }}
          >
            Detay
          </button>
          <button
            type="button"
            className="product-action-btn"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product.id}/edit`); 
            }}
          >
            Düzenle
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductRow;