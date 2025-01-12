import connectMongo from "@/lib/db";
import Url from "@/model/url";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    const { originalUrl, shortUrl, expirationDate, isPasswordProtected, password } = await req.json();

    if (!originalUrl) {
      return NextResponse.json({ error: "'originalUrl' is required" }, { status: 400 });
    }

    const urlPattern = /^(https?:\/\/[^\s]+)$/;
    if (!urlPattern.test(originalUrl)) {
      return NextResponse.json({ error: "Invalid 'originalUrl' format. It must be a valid URL." }, { status: 400 });
    }

    const generatedShortUrl = shortUrl || nanoid(6);

    const existing = await Url.findOne({ shortUrl: generatedShortUrl });
    if (existing) {
      return NextResponse.json({ error: "The short URL already exists. Please choose a different one." }, { status: 400 });
    }

    const newUrl = await Url.create({
      originalUrl,
      shortUrl: generatedShortUrl,
      expirationDate: expirationDate || null,
      isPasswordProtected,
      password: isPasswordProtected ? password : undefined,
    });

    return NextResponse.json({ message: "URL shortened successfully", shortUrl: newUrl.shortUrl }, { status: 201 });
  } catch (error) {
    console.error("Error occurred while shortening URL:", error);
    return NextResponse.json({ error: "Internal Server Error. Please try again later." }, { status: 500 });
  }
}

