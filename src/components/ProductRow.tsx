import type { FC } from 'react';
import type { RawProduct } from '../types/product';
import { getGlitchScore, normalizeProduct } from '../utils/normalize';

interface ProductRowProps {
  product: RawProduct;
}

const ProductRow: FC<ProductRowProps> = ({ product }) => {
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
        {normalized.name}
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
    </tr>
  );
};

export default ProductRow;