import React from 'react';
import Hero from '../components/Hero';

/**
 * Example of how to use the Hero component on your website
 * This component automatically syncs with Firebase in real-time
 */
export default function WebsiteExample() {
  return (
    <div>
      {/* Hero Section - Syncs with Firebase automatically */}
      <Hero />
      
      {/* Rest of your website content */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Your Other Sections</h2>
          <p>Add your other website sections here...</p>
        </div>
      </section>
    </div>
  );
}
