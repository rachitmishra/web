import { redirect } from "react-router";
import { getSignOutCookie } from "../lib/auth.server";
import { signOutUser as clientSignOut } from "../services/authService";

export async function loader() {
  return redirect("/");
}

export async function action() {
  return redirect("/", {
    headers: {
      "Set-Cookie": getSignOutCookie(),
    },
  });
}

export default function Logout() {
  return null;
}
