import { redirect } from "next/navigation";

export default function Home() {
  // Ana sayfadan login sayfasına yönlendir
  redirect("/auth/login");
}
  