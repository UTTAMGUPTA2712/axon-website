import { NextResponse } from "next/server";
import { api, ApiError } from "@/lib/api";

/**
 * Everything the account holds, as one JSON file. A Route Handler rather than a Server
 * Action because the browser has to be handed a file, and the session cookie rides along
 * on a plain link.
 */
export async function GET() {
  try {
    const data = await api("/account/export", { raw: true });
    return new NextResponse(JSON.stringify(data, null, 2), {
      headers: {
        "content-type": "application/json",
        "content-disposition": 'attachment; filename="axon-export.json"',
        "cache-control": "no-store",
      },
    });
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 502;
    return new NextResponse("Could not export your data.", { status });
  }
}
