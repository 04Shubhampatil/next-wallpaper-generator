# Next.js JWT Authentication (Cookie Based)

This project demonstrates **JWT Authentication in Next.js** using:

* **App Router API routes**
* **JWT tokens**
* **HTTP-only cookies**
* **Middleware route protection**
* **MySQL database**
* **bcrypt password hashing**

---

# Features

* User Login API
* JWT Token Generation
* HTTP-only Secure Cookies
* Middleware Route Protection
* Redirect unauthorized users
* Auto redirect logged-in users
* Password hashing using bcrypt

---

# Project Structure

```
project-root
│
├── app
│   ├── api
│   │   └── login
│   │       └── route.js
│
├── lib
│   ├── auth.js
│   └── db.js
│
├── middleware.js
│
└── README.md
```

---

# Installation

Install required dependencies:

```bash
npm install jsonwebtoken bcrypt mysql2
```

---

# JWT Authentication Logic

Authentication works in **3 steps**:

1. User logs in with email & password
2. Server generates a **JWT token**
3. Token is stored in **HTTP-only cookie**

Middleware verifies the token on protected routes.

---

# 1. JWT Utility (`lib/auth.js`)

Handles **token creation and verification**.

```javascript
import jwt from "jsonwebtoken";

const secret = "ffdfdfdfdgdgdgdydydy";

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
```

---

# 2. Login API (`app/api/login/route.js`)

Handles user login and sets JWT cookie.

```javascript
import { NextResponse } from "next/server";
import { db } from "@/lib/db.js";
import bcrypt from "bcrypt";
import { setUser } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const [users] = await db.query(
      "SELECT id, name, email, password FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }

    const user = users[0];

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 400 }
      );
    }

    const token = setUser({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "User logged in successfully",
        userId: user.id,
      },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
```

---

# 3. Middleware Authentication (`middleware.js`)

Middleware protects routes and redirects users.

```javascript
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";

export function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;

  const isPublic =
    path === "/login" ||
    path === "/register";

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    const user = getUser(token);

    if (!user) {
      const response = NextResponse.redirect(
        new URL("/login", request.url)
      );

      response.cookies.delete("token");
      return response;
    }

    if (isPublic) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
```

---

# Middleware Behavior

| Scenario                        | Result                                |
| ------------------------------- | ------------------------------------- |
| Not logged in → protected page  | Redirect to `/login`                  |
| Logged in → login/register page | Redirect to `/home`                   |
| Invalid token                   | Cookie deleted + redirect to `/login` |
| Valid token                     | Allow access                          |

---

# Database Example

Example **users table**:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255)
);
```

---

# Security Notes

For production use:

```javascript
secure: true
```

Also move the JWT secret to **environment variables**.

Example:

```
JWT_SECRET=your_secret_key
```

Then update:

```javascript
const secret = process.env.JWT_SECRET;
```

---

# API Test Example

Login request:

```json
POST /api/login

{
  "email": "user@example.com",
  "password": "123456"
}
```

Response:

```json
{
  "success": true,
  "message": "User logged in successfully",
  "userId": 1
}
```

---

# Future Improvements

* Register API
* Logout API
* Refresh Tokens
* Role-based authorization
* Protected API routes
* OAuth login

---

# Author

Next.js Authentication Example using **JWT + Cookies + Middleware**
