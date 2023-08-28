import { NextJSLogo } from "@/res/logos/NextJSLogo";
import { OpenAILogo } from "@/res/logos/OpenAILogo";
import { StripeLogo } from "@/res/logos/StripeLogo";
import { TierLogo } from "@/res/logos/TierLogo";
import { VercelLogo } from "@/res/logos/VercelLogo";

export function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center pb-24">
      <span className="h3 text-slate-11 mb-5 mt-12">Powered By</span>
      {/* Logos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
        <TierLogo />
        <OpenAILogo />
        <NextJSLogo />
        <VercelLogo />
        <div className="col-span-2 sm:col-span-1 flex justify-center">
          <StripeLogo />
        </div>
      </div>
    </footer>
  );
}


