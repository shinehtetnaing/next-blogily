"use client";

import FacePile from "@convex-dev/presence/facepile";
import usePresence from "@convex-dev/presence/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

type Props = {
  roomId: Id<"blogs">;
  userId: string;
};

const BlogPresence = ({ roomId, userId }: Props) => {
  const presenceState = usePresence(api.presence, roomId, userId);

  if (!presenceState || presenceState.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <p className="text-muted-foreground text-xs tracking-wide uppercase">
        viewing now
      </p>
      <div className="text-black">
        <FacePile presenceState={presenceState} />
      </div>
    </div>
  );
};

export default BlogPresence;
