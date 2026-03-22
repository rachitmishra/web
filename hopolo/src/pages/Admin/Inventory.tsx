import React, { useState, useEffect } from 'react';
import { useSubmit, useActionData, useLoaderData } from 'react-router';
import { fetchProducts, saveProduct } from '../../services/productService.server';
import { type Product } from '../../services/productService';
import { requireRole } from '../../lib/auth.server';
import Card from '../../components/ui/Card/Card';
import Button from '../../components/ui/Button/Button';
import ProductForm from './ProductForm';
import styles from './Inventory.module.css';

export async function loader({ request }: { request: Request }) {
  await requireRole(request, ['admin']);
  const products = await fetchProducts();
  return { products };
}

export async function action({ request }: { request: Request }) {
  await requireRole(request, ['admin']);
  const formData = await request.formData();
  const productJson = formData.get("product") as string;
  
  try {
    const productData = JSON.parse(productJson);
    await saveProduct(productData);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

const Inventory: React.FC = () => {
  const { products: initialProducts } = useLoaderData() as { products: Product[] };
  const actionData = useActionData() as { success: boolean, error?: string };
  const submit = useSubmit();

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (actionData?.success) {
      setIsAdding(false);
      // In a real app, we'd probably revalidation or refresh from loader
      // React Router handles this automatically if using its <Form> or submit()
    }
  }, [actionData]);

  const handleSaveProduct = async (productData: any) => {
    submit(
      { product: JSON.stringify(productData) },
      { method: 'post' }
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Inventory</h1>
        <Button onClick={() => setIsAdding(true)}>Add Product</Button>
      </div>

      {isAdding && (
        <Card className={styles.formCard}>
          <h2>Add New Product</h2>
          <ProductForm onSave={handleSaveProduct} onCancel={() => setIsAdding(false)} />
        </Card>
      )}

      <div className={styles.grid}>
        {products.map((product) => (
          <Card key={product.id} className={styles.productCard}>
            <div className={styles.productInfo}>
              <img 
                src={product.images?.[0] || product.image || 'https://via.placeholder.com/150'} 
                alt={product.name} 
                className={styles.thumbnail}
              />
              <div>
                <h3>{product.name}</h3>
                <p className={styles.category}>{product.category}</p>
                <p className={styles.price}>${product.price}</p>
              </div>
            </div>
            <div className={styles.actions}>
              <Button variant="outline" style={{ fontSize: '0.75rem' }}>Edit</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
