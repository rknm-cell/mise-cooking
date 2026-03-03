import { Suspense } from "react"
import { LoginForm } from "~/app/components/auth/login-form"

function LoginFormFallback() {
  return (
    <div className="flex min-h-[320px] w-full max-w-sm animate-pulse flex-col gap-6 rounded-lg bg-[#428a93]/50 p-6" />
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#1d7b86] to-[#426b70] p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex flex-col items-center justify-center self-center">
          <span className="nanum-pen-script-regular text-6xl text-[#fcf45a]">
            Mise
          </span>
          <span className="nanum-pen-script-regular text-2xl text-[#fcf45a]">
            (meez)
          </span>
        </a>
        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
