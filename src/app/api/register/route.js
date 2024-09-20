
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connection } from "@/utils/db";
import User from "@/model/User";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    await connection();
    await User.create({ name, email, password: hashedPassword });
    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while registering the user." },
      { status: 500 }
    );
  }
}
