// import { currentProfilePage } from "@/lib/current-profile-pages";
// import { db } from "@/lib/db";
// import { NextApiResponseServerIo } from "@/types";
// import { NextApiRequest } from "next";

// export default async function Handler(
//   req: NextApiRequest,
//   res: NextApiResponseServerIo
// ) {
//   if (req.method !== "GET" && req.method !== "PATCH") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }
//   try {
//     const profile = await currentProfilePage(req);
//     const { serverId, channelId } = req.query;
//     const { canvasData,canvasFile } = req.body;
//     if (!profile) {
//       return res.status(401).json({ error: "Unauthorised" });
//     }
//     if (!serverId) {
//       return res.status(400).json({ error: "Server ID is missing" });
//     }
//     if (!channelId) {
//       return res.status(400).json({ error: "Channel ID is missing" });
//     }

//     const server = await db.server.findFirst({
//       where: {
//         id: serverId as string,
//         members: {
//           some: {
//             profileId: profile.id,
//           },
//         },
//       },
//       include: {
//         members: true,
//       },
//     });

//     if (!server) {
//       return res.status(404).json({ error: "Server not found" });
//     }

//     const channel = db.channel.findFirst({
//       where: {
//         id: channelId as string,
//         serverId: serverId as string,
//       },
//     });

//     if (!channel) {
//       return res.status(404).json({ error: "Channel not found" });
//     }

//     const member = server.members.find(
//       (member) => member.profileId === profile.id
//     );
//     if (!member) {
//       return res.status(404).json({ error: "Member not found" });
//     }

//     let slate = await db.slate.findFirst({
//               where: {
//                 channelId: channelId as string,
//               },
//             });
        
//             if (!slate) {
//               slate = await db.slate.create({
//                 data: {
//                   channelId: channelId as string,
//                   canvasData,
//                   canvasFile,
//                 },
//               });
//             } else {
//               slate = await db.slate.update({
//                 where: {
//                   channelId: channelId as string,
//                   id: slate.id,
//                 },
//                 data: {
//                   canvasData,
//                   canvasFile,
//                 },
//               });
//             }

//     if (!slate) {
//       return res.status(404).json({ error: "Slate not found" });
//     }

    
//     if (req.method === "GET") {
//         await db.slate.findFirst({
//                   where: {
//                     channelId: channelId as string,
//                   },
//                 });
//     }

//     if (req.method === "PATCH") {
     
//         slate = await db.slate.update({
//                     where: {
//                       channelId: channelId as string,
//                       id: slate.id,
//                     },
//                     data: {
//                       canvasData,
//                       canvasFile,
//                     },
//                   });
//     }

//     const addKey = `chat:${channelId}:slate:add`;

//     res?.socket?.server?.io?.emit(addKey, slate);
//     res?.socket?.server?.io?.emit("hello",()=>{ 
//       return "hello there welcome to socket.io slate";
//     })

//     return res.status(200).json(slate);
//   } catch (error) {
//     console.log("[SLATE_CHANNEL_ERROR]", error);
//     return res.status(500).json({ error: "Internal Error" });
//   }
// }
