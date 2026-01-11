import { describe, it, expect } from 'vitest';
import { generateDeliveryFeedbackHtml } from './deliveryFeedback';

describe('deliveryFeedback Template', () => {
  it('should generate valid HTML with feedback links', () => {
    const mockOrder = {
      id: 'o123',
    };

    const html = generateDeliveryFeedbackHtml(mockOrder.id);

    expect(html).toContain('How was your experience');
    expect(html).toContain('o123');
    expect(html).toContain('😊');
    expect(html).toContain('😐');
    expect(html).toContain('😞');
  });
});
