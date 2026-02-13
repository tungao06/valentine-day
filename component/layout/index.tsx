import Head from "next/head";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex flex-col w-full min-h-screen overflow-x-hidden overflow-y-auto bg-gradient-to-b from-pink-50 via-rose-50 to-pink-100 selection:bg-rose-400 selection:text-white">
      <Head>
        <title>Happy Valentine's Day 💕</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="A special Valentine's Day surprise" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
      </Head>
      <main className="flex flex-col w-full">
        {children}
      </main>
    </div>
  );
};

export default Layout;
