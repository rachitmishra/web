import MainLayout from './components/layout/MainLayout';
import Button from './components/ui/Button/Button';
import Input from './components/ui/Input/Input';
import Card from './components/ui/Card/Card';
import Hero from './components/ui/Hero/Hero';
import ProductCard from './components/ui/ProductCard/ProductCard';
import CategoryTabs from './components/ui/CategoryTabs/CategoryTabs';
import './App.css';

function App() {
  const sampleProduct = {
    id: '1',
    name: 'Classic White Tee',
    price: 19.99,
    category: 'Clothing',
    rating: 4.8
  };

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'elec', name: 'Electronics' },
    { id: 'cloth', name: 'Clothing' },
  ];

  return (
    <MainLayout>
      <Hero 
        title="Welcome to Hopolo" 
        subtitle="Minimalist boutique shopping experience with delightful details."
      >
        <Button onClick={() => alert('Shopping!')}>Start Shopping 🛍️</Button>
      </Hero>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
        <section>
          <CategoryTabs 
            categories={categories} 
            activeCategoryId="all" 
            onSelectCategory={(id) => console.log('Selected:', id)} 
          />
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-6)' }}>
            <ProductCard 
              product={sampleProduct} 
              onAddToCart={(p) => alert(`Added ${p.name} to cart`)}
            />
            {/* Repeat for visual check */}
            <ProductCard 
              product={{...sampleProduct, id: '2', name: 'Cool Gadget', price: 99.99}} 
              onAddToCart={() => {}}
            />
          </div>
        </section>

        <Card>
          <h3 style={{ marginBottom: 'var(--spacing-4)' }}>Form Elements</h3>
          <Input label="Your Name" placeholder="Enter your name" />
          <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
            <Button variant="secondary">Cancel</Button>
            <Button variant="primary">Submit</Button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}

export default App;