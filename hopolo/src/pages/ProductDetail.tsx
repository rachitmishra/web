import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button/Button';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div style={{ padding: 'var(--spacing-8)' }}>
      <Button variant="outline" onClick={() => navigate(-1)} style={{ marginBottom: 'var(--spacing-4)' }}>
        &larr; Back
      </Button>
      <h1>Product Detail: {id}</h1>
      <p>This is a placeholder for product {id}. Full details coming soon!</p>
    </div>
  );
};

export default ProductDetail;
