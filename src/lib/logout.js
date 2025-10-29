export function logout(res) {
  res.cookies.set({
    name: "auth_token",
    value: "",
    maxAge: 0,
    path: "/",
  });
}
