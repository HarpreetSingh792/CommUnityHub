import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      channelId: string;
    };
  }
) {
  try {
    const profile = await currentProfile();

    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID is missing", { status: 400 });
    }

    if (!params?.channelId) {
      return new NextResponse("Missing Channel ID ", { status: 400 });
    }

    const channel = await db.slate.findFirst({
      where: {
        channelId: params.channelId,
      },
    });
    return NextResponse.json(channel);
  } catch (error) {
    console.log("[SLATE_DATA_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
export async function POST(
  req: Request,
  {
    params,
  }: {
    params: {
      channelId: string;
    };
  }
) {
  try {
    const { canvasData, canvasFile } = await req.json();

    const profile = await currentProfile();

    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID is missing", { status: 400 });
    }

    if (!params?.channelId) {
      return new NextResponse("Missing Channel ID ", { status: 400 });
    }

    let slate = await db.slate.findFirst({
      where: {
        channelId: params.channelId,
      },
    });

    if (!slate) {
      slate = await db.slate.create({
        data: {
          channelId: params.channelId,
          canvasData,
          canvasFile,
        },
      });
    } else {
      slate = await db.slate.update({
        where: {
          channelId: params.channelId,
          id: slate.id,
        },
        data: {
          canvasData,
          canvasFile,
        },
      });
    }

    return NextResponse.json(slate);
  } catch (error) {
    console.log("[SLATE_CREATION_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
