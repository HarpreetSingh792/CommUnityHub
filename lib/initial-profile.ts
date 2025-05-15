import { currentUser, redirectToSignIn } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const initialProfile = async ():Promise<any| {
  id: string;
  userId: string;
  name: string;
  imageUrl: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}> =>{
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  const profile = await db.profile.findFirst({
    where: {
      userId: user.id,
    },
  });

  if (profile) {
    return {
      id: profile.id,
      userId: profile.userId,
      name: profile.name,
      imageUrl: profile.imageUrl,
      email: profile.email,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return newProfile;
};
