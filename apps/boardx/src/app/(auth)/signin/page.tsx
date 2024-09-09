import { SignInForm } from "@/components/forms/sign-in";
import Logo from "@/components/Logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Suspense } from "react";

const SignIn = () => {
  return (
    <Card className="flex flex-col items-center justify-center min-w-full md:min-w-[450px] rounded-xl">
      <CardHeader className="flex flex-col items-center justify-center">
        <CardTitle>
          <Logo />
        </CardTitle>
        <CardDescription>Sign up to project planit</CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <Suspense>
          <SignInForm />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default SignIn;
