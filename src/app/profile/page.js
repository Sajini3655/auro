import { cookies } from "next/headers";
import { verifyToken } from "../../lib/auth";
import { redirect } from "next/navigation";

export default function ProfilePage() {
  const auth = localStorage.getItem("auth");
  const user = auth ? JSON.parse(auth) : null;

  if (!user || !verifyToken(user.token)) {
    redirect("/login");
  }

  return <div>Welcome, {user.username}!</div>;
}
