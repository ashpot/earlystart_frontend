/* eslint-disable no-undef */
// src/components/Layout.jsx
import React from 'react';

export default function Layout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased leading-8 overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}