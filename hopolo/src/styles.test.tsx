import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Global Styles', () => {
  it('should define box-sizing: border-box globally in index.css', () => {
    const cssPath = path.resolve(__dirname, 'index.css');
    const cssContent = fs.readFileSync(cssPath, 'utf-8');
    
    expect(cssContent).toContain('box-sizing: border-box');
  });

  it('should define CSS variables for colors', () => {
    const cssPath = path.resolve(__dirname, 'index.css');
    const cssContent = fs.readFileSync(cssPath, 'utf-8');
    
    expect(cssContent).toContain('--color-primary:');
    expect(cssContent).toContain('--color-background:');
  });
});