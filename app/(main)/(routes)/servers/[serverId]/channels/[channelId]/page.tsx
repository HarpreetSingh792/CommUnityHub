import { ChatMessages } from "@/components/chat-messages";
import ChatHeader from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { MediaRoom } from "@/components/media-room";
import TaskColumnModal from "@/components/modals/create-task-column-model";
import Canvas from "@/components/slate/slate-main";
import Todo from "@/components/todo/todo";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs/server";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";

interface ChannelIDPageProps {
  params: {
    channelId: string;
    serverId: string;
  };
}

export default async function Page({ params }: ChannelIDPageProps) {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  if (!params.channelId) {
    return redirect(`/servers/${params.serverId}`);
  }

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
    include: {
      TaskColumn: true,
    },
  });
  

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile?.id,
    },
  });

  

  if (!channel || !member) {
    return redirect("/");
  }

  let slateComponent = null;

  if (channel.type === ChannelType.SLATE) {
    const canAudit = member.role === "ADMIN" || member.role === "MODERATOR";
    slateComponent = <Canvas canAudit={canAudit} />;
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-screen place-content-between">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            name={channel.name}
            chatId={channel.id}
            member={member}
            type="channel"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            paramKey="channelId"
            paramValue={channel.id}
          />
          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
          />
        </>
      )}

      {channel.type === ChannelType.AUDIO && (
        <MediaRoom chatId={channel.id} video={false} audio={false} />
      )}
      {channel.type === ChannelType.VIDEO && (
        <MediaRoom chatId={channel.id} video={true} audio={true} />
      )}

      {channel.type === ChannelType.SLATE && slateComponent}

      {channel.type === ChannelType.TODO && <>
      {
        member.role === "ADMIN" || member.role === "MODERATOR"?(
        channel.TaskColumn?.length>0?
        <Todo  profileId={profile.id} role={member.role}  />:
        <TaskColumnModal />):<Todo profileId={profile.id} role={member.role} />
      }
      </>}
    </div>
  );
}
