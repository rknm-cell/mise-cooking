import { SignupForm } from "~/app/components/auth/signup-form"

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-[#1d7b86] to-[#426b70] p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex flex-col items-center justify-center self-center">
          <span className="nanum-pen-script-regular text-6xl text-[#fcf45a]">
            Mise
          </span>
          <span className="nanum-pen-script-regular text-2xl text-[#fcf45a]">
            (meez)
          </span>
        </a>
        <SignupForm />
      </div>
    </div>
  )
}
