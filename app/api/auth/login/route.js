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

        // Get user
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
    

        // Compare password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return NextResponse.json(
                { error: "Incorrect password" },
                { status: 400 }
            );
        }

        // Generate token
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

        // Set cookie
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: false, // change to true in production
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