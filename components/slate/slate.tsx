import React from "react";
import Canvas from "./slate-main";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

const Slate = async() => {

 
  const profile = await currentProfile();

  const member = await db.member.findFirst({
    where:{
      profileId:profile?.id
    }
  }) 


  const canAudit =  (member?.role==="ADMIN" || member?.role==="MODERATOR")?true:false

  
  return <Canvas canAudit={canAudit} />;
};

export default Slate;
