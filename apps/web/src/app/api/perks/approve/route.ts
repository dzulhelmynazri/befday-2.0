import { createHmac, timingSafeEqual } from "node:crypto";

import { renderPartnerPerkApprovedEmail } from "@befday-2.0/email";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { env } from "@/env.server";
import { email, getDb } from "@/services";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const token = searchParams.get("token");

  if (!(id && token)) {
    return NextResponse.json(
      { error: "Missing perk id or token" },
      { status: 400 }
    );
  }

  const expectedToken = createHmac("sha256", env.CRON_SECRET)
    .update(id)
    .digest("hex");

  const tokenBuffer = Buffer.from(token);
  const expectedBuffer = Buffer.from(expectedToken);

  if (
    tokenBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(tokenBuffer, expectedBuffer)
  ) {
    return NextResponse.json(
      { error: "Invalid or unauthorized token" },
      { status: 401 }
    );
  }

  const db = getDb();

  try {
    const existingPerk = await db.birthdayPerk.findUnique({
      include: { brand: true },
      where: { id },
    });

    if (!existingPerk) {
      return NextResponse.json({ error: "Perk not found" }, { status: 404 });
    }

    let perk = existingPerk;

    if (existingPerk.status !== "PUBLISHED") {
      perk = await db.birthdayPerk.update({
        data: {
          status: "PUBLISHED",
          verifiedAt: new Date(),
        },
        include: { brand: true },
        where: { id },
      });

      revalidateTag("perks", "max");

      if (perk.contactEmail && perk.contactName) {
        const { html: emailHtml, text: emailText } =
          await renderPartnerPerkApprovedEmail({
            brandName: perk.brand.name.toLowerCase(),
            contactName: perk.contactName.toLowerCase(),
            listingUrl: `https://www.befday.com/perks/${perk.brand.slug}`,
            perkHeadline: perk.headline.toLowerCase(),
          });

        await email.send({
          from: "befday <hello@befday.com>",
          html: emailHtml,
          subject: `your birthday perk for ${perk.brand.name.toLowerCase()} is now live on befday`,
          text: emailText,
          to: perk.contactEmail,
        });
      }
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Perk Approved - Happy befday!</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #09090b;
      color: #fafafa;
    }
    .card {
      text-align: center;
      max-width: 420px;
      padding: 2.5rem 2rem;
      border-radius: 1rem;
      border: 1px solid #27272a;
      background: #18181b;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5);
    }
    .badge {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      padding: 0.25rem 0.6rem;
      border-radius: 9999px;
      background: #10b9811a;
      color: #34d399;
      border: 1px solid #10b98133;
      margin-bottom: 1rem;
      text-transform: lowercase;
    }
    h1 {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      letter-spacing: -0.02em;
    }
    p {
      color: #a1a1aa;
      font-size: 0.875rem;
      line-height: 1.5;
      margin: 0 0 1.75rem 0;
    }
    .btn {
      display: inline-block;
      padding: 0.625rem 1.25rem;
      border-radius: 0.5rem;
      background: #fafafa;
      color: #09090b;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 600;
      transition: opacity 0.15s;
    }
    .btn:hover {
      opacity: 0.9;
    }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">verified & published</span>
    <h1>perk approved!</h1>
    <p>birthday perk for <strong>${perk.brand.name.toLowerCase()}</strong> is now live on befday.com.</p>
    <a class="btn" href="/perks/${perk.brand.slug}">view on befday</a>
  </div>
</body>
</html>`;

    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch {
    return NextResponse.json(
      { error: "Perk not found or update failed" },
      { status: 404 }
    );
  }
};
