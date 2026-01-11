export const generateDeliveryFeedbackHtml = (orderId: string): string => {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
      <h1 style="color: #333;">Your order has arrived! 📦</h1>
      <p>We hope you love your new purchase from Hopolo.</p>
      
      <div style="margin: 40px 0; padding: 30px; background: #fdfdfd; border: 1px solid #eee; border-radius: 12px;">
        <h2 style="font-size: 1.2em; margin-bottom: 20px;">How was your experience?</h2>
        <div style="font-size: 3em; display: flex; justify-content: center; gap: 20px;">
          <a href="https://hopolo.vercel.app/feedback/${orderId}/great" style="text-decoration: none;">😊</a>
          <a href="https://hopolo.vercel.app/feedback/${orderId}/okay" style="text-decoration: none;">😐</a>
          <a href="https://hopolo.vercel.app/feedback/${orderId}/bad" style="text-decoration: none;">😞</a>
        </div>
        <p style="margin-top: 20px; color: #666; font-size: 0.9em;">Click an emoji to let us know!</p>
      </div>

      <p style="color: #999; font-size: 0.8em; margin-top: 40px;">
        Order ID: ${orderId}
      </p>
    </div>
  `;
};
