import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-white mb-2">Welcome back</h1>
        <p className="text-white/50 text-sm">Sign in to your Apex account</p>
      </div>
      <SignIn
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "bg-[#111111] border border-white/10 shadow-2xl rounded-2xl",
            headerTitle: "text-white",
            headerSubtitle: "text-white/50",
            socialButtonsBlockButton: "bg-[#1A1A1A] border border-white/10 text-white hover:bg-[#222222]",
            dividerLine: "bg-white/10",
            dividerText: "text-white/40",
            formFieldLabel: "text-white/70",
            formFieldInput: "bg-[#1A1A1A] border-white/10 text-white",
            formButtonPrimary: "bg-indigo-500 hover:bg-indigo-400",
            footerActionLink: "text-indigo-400 hover:text-indigo-300",
            identityPreviewText: "text-white",
            identityPreviewEditButtonIcon: "text-white/60",
          },
        }}
      />
    </div>
  );
}
