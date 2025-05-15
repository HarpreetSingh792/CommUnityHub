"use client"

import Image from "next/image";
import { useParams,useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import ActionTooltip from "@/components/action-tooltip"

interface NavigationItemProps{
    id:string;
    imageUrl:string;
    name:string;
}



const NavigationItem = ({id,imageUrl,name}:NavigationItemProps) => {
    
    const params = useParams();
    const router = useRouter();
    const onClick = ()=>{
        router.push(`/servers/${id}`)
    }
    return (
    <ActionTooltip side="right" align="center" label={name}>
        <button className="group relative items-center" onClick={onClick}>
            <div className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 bg-primary rounded-r-full transition-all w-[4px]",
                params?.serverId !== id && 'group-hover:h-[40px]',
                params?.serverId === id ? 'h-[46px]':'[h-8px]'
            )}>
            </div>
            <div className={cn("relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",params?.serverId===id&&"bg-primary/10 text-primary rounded-[16px]")}>
                <Image fill src={imageUrl} sizes="48px" alt="Channel" />
            </div>
        </button>
    </ActionTooltip>
  )
}

export default NavigationItem