import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.text();
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new NextResponse("Missing svix headers", { status: 400 });
  }

  let event: { type: string; data: Record<string, unknown> };
  try {
    const { Webhook } = await import("svix");
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as { type: string; data: Record<string, unknown> };
  } catch {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  if (event.type === "user.created" || event.type === "user.updated") {
    try {
      await fetch(`${apiUrl}/api/v1/users/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_type: event.type, data: event.data }),
      });
    } catch {
      // Backend may not be running yet — log silently
      console.warn("Could not sync user to backend:", event.type);
    }
  }

  return NextResponse.json({ received: true });
}
