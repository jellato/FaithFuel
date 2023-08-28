import Link from "next/link";

import { BgPattern } from "@/components/ui/Bgpattern";
import { SignUpButton } from "@/components/marketing/LandingSignUp";

export default function IndexPage() {
  return (
    <div className="flex flex-col justify-between">
      {/* Bg Pattern */}
      <BgPattern />

      {/* Hero Copy */}
      <div className="flex-grow flex flex-col items-center gap-4 px-4 mt-6 md:mt-16">
        <h1 className="mt-10 text-4xl md:text-h2 text-center w-full">
          Daily Fuel For<span className="text-crimson-9"> <br/>Your Faith</span>
        </h1>
        <p className="text-lg md:text-xl text-center text-slate-11">
          Start Getting Personalized <br/>AI Devotionals Today!
        </p>
      </div>

      {/* Hero CTA */}
      <div className="flex flex-col items-center gap-4 md:mb-16 mt-10">
        <p className="text-md md:body">
          Get your <span className="font-semibold">free account today</span>
        </p>
        <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
          <SignUpButton className="block" />
        </div>
        <p className="text-xs md:caption text-slate-11">No credit card required</p>
      </div>
    </div>
  );
}
