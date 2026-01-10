import MainLayout from './components/layout/MainLayout';
import Button from './components/ui/Button/Button';
import Input from './components/ui/Input/Input';
import Card from './components/ui/Card/Card';
import './App.css';

function App() {
  return (
    <MainLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
        <Card>
          <h2 style={{ marginBottom: 'var(--spacing-4)' }}>Welcome to Hopolo</h2>
          <p>Building the future of commerce, one component at a time.</p>
        </Card>

        <Card>
          <h3 style={{ marginBottom: 'var(--spacing-4)' }}>Component Showcase</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <Input label="Showcase Input" placeholder="Type something..." />
            
            <div style={{ display: 'flex', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
            </div>

            <div style={{ display: 'flex', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
              <Button variant="primary" loading>Loading</Button>
              <Button variant="primary" disabled>Disabled</Button>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}

export default App;
