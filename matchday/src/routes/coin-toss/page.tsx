import React, { useState } from 'react';
import Head from 'next/head';
import { useSpring, animated } from 'react-spring';

export default function CoinToss() {
  const [result, setResult] = useState(null); // Heads, Tails, or null (before toss)

  const coinRotation = useSpring({
    from: { rotateY: 0 },
    to: async () => {
      // Simulate random flip duration
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 500));
      return Math.random() > 0.5 ? { rotateY: 180 } : { rotateY: 0 };
    },
    config: { tension: 200, friction: 80 },
  });

  const handleToss = () => {
    setResult(null); // Reset result before each toss
    coinRotation.start(); // Trigger animation
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Coin Toss</title>
        <meta name="description" content="Toss a coin with this fun animation" />
      </Head>

      <h1 className="text-2xl font-bold text-center">Coin Toss</h1>

      <animated.div
        style={{ ...coinRotation }}
        className="flex justify-center mt-8"
      >
        <p>🪙</p>
      </animated.div>

      {result && (
        <h2 className="text-xl font-bold text-center mt-4">
          {result === 'Heads' ? 'Heads!' : 'Tails!'}
        </h2>
      )}

      <button
        onClick={handleToss}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        disabled={!!result} // Disable button while animating
      >
        Toss Coin!
      </button>
    </div>
  );
}