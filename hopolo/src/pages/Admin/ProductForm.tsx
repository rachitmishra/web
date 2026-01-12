import React, { useState } from 'react';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import styles from './ProductForm.module.css';
import { Variant } from '../../services/productService';
import { uploadProductImages } from '../../services/storageService';

interface ProductFormProps {
  onCancel: () => void;
  onSave: (data: any) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onCancel, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    discount: '',
  });

  const [variants, setVariants] = useState<Omit<Variant, 'id'>[]>([]);
  const [newVariant, setNewVariant] = useState({ size: '', color: '', stock: '' });
  
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleAddVariant = () => {
    if (newVariant.size && newVariant.color && newVariant.stock) {
      setVariants([...variants, { 
        size: newVariant.size, 
        color: newVariant.color, 
        stock: parseInt(newVariant.stock) 
      }]);
      setNewVariant({ size: '', color: '', stock: '' });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploading(true);
      try {
        const files = Array.from(e.target.files);
        const urls = await uploadProductImages(files);
        setImages([...images, ...urls]);
      } catch (err) {
        console.error('Upload failed:', err);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, variants, images });
  };

  return (
    <div className={styles.container}>
      <h2>Add Product</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Core Details</div>
          <Input 
            label="Product Name" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})}
            required 
          />
          <div className={styles.row}>
            <Input 
              label="Price" 
              type="number"
              value={formData.price} 
              onChange={e => setFormData({...formData, price: e.target.value})}
              required 
            />
            <Input 
              label="Category" 
              value={formData.category} 
              onChange={e => setFormData({...formData, category: e.target.value})}
              required 
            />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Media</div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="image-upload" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Upload Images</label>
            <input 
              id="image-upload" 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={handleImageUpload} 
              disabled={uploading}
            />
            {uploading && <span style={{ marginLeft: '1rem' }}>Uploading...</span>}
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {images.map((url, i) => (
              <img key={i} src={url} alt={`Product Image ${i + 1}`} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Variants</div>
          <div className={styles.variantRow}>
            <Input 
              placeholder="Size (e.g. S, M)" 
              value={newVariant.size}
              onChange={e => setNewVariant({...newVariant, size: e.target.value})}
            />
            <Input 
              placeholder="Color (e.g. Red)" 
              value={newVariant.color}
              onChange={e => setNewVariant({...newVariant, color: e.target.value})}
            />
            <Input 
              placeholder="Stock" 
              type="number"
              value={newVariant.stock}
              onChange={e => setNewVariant({...newVariant, stock: e.target.value})}
            />
            <Button type="button" onClick={handleAddVariant}>Add Variant</Button>
          </div>

          {variants.length > 0 && (
            <div className={styles.variantList}>
              {variants.map((v, i) => (
                <div key={i} className={styles.variantItem}>
                  <span>{v.size}</span>
                  <span>{v.color}</span>
                  <span>{v.stock}</span>
                  <Button variant="outline" style={{padding: '2px 6px', fontSize: '0.7rem'}}>Remove</Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Save Product</Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
