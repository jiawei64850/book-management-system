import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "antd/dist/reset.css"
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for user in localStorage after component mounts
    const user = localStorage.getItem("user");
    if (user) {
      setIsAuthenticated(true); // User is authenticated
    } else {
      router.push('/login'); // Redirect to login page if not authenticated
    }
  }, [router]);

  // Render only if the user is authenticated
  if (!isAuthenticated) {
    return null; // Prevents rendering before redirection occurs
  }

  return (
    router.pathname == '/login' ? 
    (
      <Component {...pageProps} />
    ) :
    (
    <Layout>
      <Component {...pageProps} />
    </Layout>
    )
  );
};
