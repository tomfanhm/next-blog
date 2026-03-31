import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";
import { OAuthButtons } from "@/components/auth/oauth-buttons";

export const metadata = { title: "Sign In" };

export default function SignInPage() {
  return (
    <LoginForm
      oauthButtons={<OAuthButtons />}
      footer={
        <p className="text-muted-foreground text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-foreground font-medium hover:underline">
            Register
          </Link>
        </p>
      }
    />
  );
}
