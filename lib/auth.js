import jwt from "jsonwebtoken";

const secret ="ffdfdfdfdgdgdgdydydy";

export function setUser(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    secret,
    { expiresIn: "7d" }
  );
}

export function getUser(token) {
  if (!token) return null;

  try {
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
}