import Link from "next/link";

import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata = { title: "Sign Up" };

export default function SignUpPage() {
  return (
    <RegisterForm
      oauthButtons={<OAuthButtons />}
      footer={
        <p className="text-muted-foreground text-center text-sm">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-foreground font-medium hover:underline">
            Sign in
          </Link>
        </p>
      }
    />
  );
}
