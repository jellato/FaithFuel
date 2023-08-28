import { Metadata } from "next";

import { TIER_AICOPY_FEATURE_ID } from "@/config/tierConstants";
import { getCurrentUser } from "@/lib/session";
import { tier } from "@/lib/tier";
import { Generate } from "@/components/app/GenerateSection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Generate Devotionals",
  description: "Generate AI Devotionals Based on Your Journal Entries",
};

export default async function GeneratePage() {
  const user = await getCurrentUser();

  // Fetch the feature consumption and limit of the AI copy feature for the plan currently subscribed
  const featureLimits = await tier.lookupLimit(`org:${user?.id}`, TIER_AICOPY_FEATURE_ID);

  return (
    <>
      <Generate user={user} featureLimits={featureLimits} />
    </>
  );
}
