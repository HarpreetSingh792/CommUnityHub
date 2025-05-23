import { ScrollArea } from "@/components/ui/scroll-area";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import {
  Hash,
  Mic,
  PenLine,
  ShieldAlert,
  ShieldCheck,
  Video,
  ListTodo
} from "lucide-react";
import { redirect } from "next/navigation";
import ServerHeader from "./server-header";
import { ServerSearch } from "./server-search";
import { Separator } from "@/components/ui/separator";
import { ServerSection } from "./server-section";
import { channel } from "diagnostics_channel";
import { ServerChannel } from "./server-channel";
import { ServerMember } from "./server-member";
import ProgressBar from "../ui/progress-bar";
import { OverallProgress } from "../todo/overallProgress";

interface ServerSidebarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
  [ChannelType.SLATE]: <PenLine className="mr-2 h-4 w-4" />,
  [ChannelType.TODO]:<ListTodo className="mr-2 h-4 w-4"/>
};

const roleIconMap = {
  [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 mr-2 text-rose-500" />,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="w-4 h-4 mr-2 text-indigo-500" />
  ),
  [MemberRole.GUEST]: null,
};

const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  if (!server) {
    return redirect("/");
  }

  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  const slateChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.SLATE
  );

  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  );

  const todoChannels = server?.channels.filter(
    (channel)=>channel.type===ChannelType.TODO
  )

  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;

 
  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channel",
                type: "channel",
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Voice Channel",
                type: "channel",
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Video Channel",
                type: "channel",
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Visualization Channel",
                type: "channel",
                data: slateChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Todo Channel",
                type: "channel",
                data: todoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              label="Text Channels"
            />
            <div className="space-y-[2px]">
              {textChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}

        {/* Audio */}
        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role}
              label="Voice Channels"
            />

            <div className="space-y-[2px]">
              {audioChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}

        {/* Video */}
        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={role}
              label="Video Channels"
            />
            <div className="space-y-[2px]">
              {videoChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}

        {/* Visualization... */}
        {!!slateChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.SLATE}
              role={role}
              label="Visualisation Channels"
            />
            <div className="space-y-[2px]">
              {slateChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}

        {/* Todo */}
        {!!todoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.TODO}
              role={role}
              label="Todo Channels"
            />
            {
              (role==="ADMIN"||role==="MODERATOR")&&
              <OverallProgress />
            }
            <div className="space-y-[2px]">
              {todoChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                  isTodo={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Members */}
        {!!members?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              channelType={ChannelType.VIDEO}
              role={role}
              label="Members"
              server={server}
            />
            <div className="space-y-[2px]">
              {members.map((member) => (
                <ServerMember key={member.id} member={member} server={server} />
              ))} 
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
