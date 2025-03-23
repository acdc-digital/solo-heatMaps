// HomePage
// /Users/matthewsimon/Documents/Github/solo-heatMaps/soloist/src/app/page.tsx

'use client'

import { useAuthActions } from "@convex-dev/auth/react";
import { ScanEye } from "lucide-react";
import { useState } from "react";

// ShadCN Components
import { Button } from "@/components/ui/button";

// Background Color
const BACKGROUND_COLOR = "#1b1b1b"; 

// Authentication UI Components
function SignInWithGitHub() {
  const { signIn } = useAuthActions();
  return (
    <Button
      className="flex-1"
      variant="outline"
      type="button"
      onClick={() => void signIn("github", { redirectTo: "/dashboard" })}
    >
      <ScanEye className="mr-2 h-4 w-4" /> GitHub
    </Button>
  );
}

// Main Sign-In Page Component 
export default function SignInPage() {
  const [step, setStep] = useState<"signIn" | "linkSent">("signIn");

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundColor: BACKGROUND_COLOR,
        overflow: "hidden",
      }}
    >

      {/* Foreground Sign In UI */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <div className="max-w-[384px] mx-auto flex flex-col gap-4 pb-8 bg-white/90 rounded-md p-6">
          {step === "signIn" ? (
            <>
              <h2 className="font-semibold text-2xl text-black tracking-tight">
                Sign in or create an account
              </h2>
              <SignInWithGitHub />
            </>
          ) : (
            <>
             <Button
                className="p-0 self-start"
                variant="link"
                onClick={() => setStep("signIn")}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}