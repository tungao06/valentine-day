import Head from "next/head";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  // Get base URL for Open Graph tags
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_SITE_URL || 'https://valentine-day-lemon.vercel.app';
  
  const siteTitle = "Happy Valentine's Day 💕";
  const siteDescription = "A special Valentine's Day surprise";
  const ogImage = `${baseUrl}/favicon.ico`; // You can create this image later
  
  return (
    <div className="relative flex flex-col w-full min-h-screen overflow-x-hidden overflow-y-auto bg-gradient-to-b from-pink-50 via-rose-50 to-pink-100 selection:bg-rose-400 selection:text-white">
      <Head>
        {/* Basic Meta Tags */}
        <title>{siteTitle}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={siteDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={baseUrl} />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Happy Valentine's Day" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={baseUrl} />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content="Happy Valentine's Day" />
      </Head>
      <main className="flex flex-col w-full">
        {children}
      </main>
    </div>
  );
};

export default Layout;
