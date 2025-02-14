import Head from "next/head";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full min-h-screen overflow-x-hidden overflow-y-auto bg-main min-w-screen selection:bg-rose-600 selection:text-white text-zinc-900">
      <Head>
        <title>DayCream</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-center flex-1 w-full sm:px-20 text-center">
        {children}
      </main>
      {/* <footer className="flex items-center justify-center w-full h-24 border-t">
          <a
            className="flex items-center justify-center gap-2"
            href="https://web3templates.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by Web3Templates
          </a>
        </footer> */}
    </div>
  );
};

export default Layout;
