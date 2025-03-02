import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const user = localStorage.getItem("user");
  if (user) {
    router.push('/book');
  } else {
    router.push('/login');
  }
  return (
    <>
      Library Management System
    </>
  );
}
