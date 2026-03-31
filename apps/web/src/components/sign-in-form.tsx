import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

import Loader from "./loader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Image from "next/image";
import { LockKeyhole, Mail } from "lucide-react";

export default function SignInForm({
  onSwitchToSignUp,
}: {
  onSwitchToSignUp: () => void;
}) {
  const router = useRouter();
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            router.push("/links");
            toast.success("Sign in successful");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        email: z.email("Invalid email address"),  
        password: z.string().min(8, "Incorrect password"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    // Outer wrapper: light bg in light mode, dark bg in dark mode
    <div className="min-h-screen  flex items-center justify-center px-4">
      {/* Card: white in light mode, dark elevated surface in dark mode */}
      <div className="w-full max-w-md ">
        <div className="flex items-center justify-center space-x-2 mb-8">
          <Image
            src="/solar_link-circle-bold.png"
            alt="Devlinks Logo"
            width={40}
            height={40}
          />
          <h1 className="text-center text-3xl font-bold text-[#333333] dark:text-white">
            Devlinks
          </h1>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4 sm:bg-white sm:dark:bg-[#23233A] p-8 sm:rounded-2xl  sm:shadow-sm dark:shadow-lg"
        >
          <div className="space-y-8 ">
            <div className="space-y-2">
              <h2 className="text-[32px] font-bold text-[#333333] dark:text-white">
                Login
              </h2>
              <p className="text-[#737373] dark:text-[#A0A0B8] font-normal text-[16px]">
                Add your details below to get back into the app
              </p>
            </div>

            <form.Field name="email">
              {(field) => (
                <div className="space-y-2 relative">
                  <Label
                    htmlFor={field.name}
                    className="text-[#333333] dark:text-[#E0E0F0]"
                  >
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail
                      className="absolute top-1/2 -translate-y-1/2 left-3 text-[#737373] dark:text-[#A0A0B8]"
                      size={16}
                    />
                    {field.state.meta.errors.map((error) => (
                    <p
                      key={error?.message}
                      className="text-red-500 text-[10px] absolute right-2 bottom-2"
                    >
                      {error?.message}
                    </p>
                  ))}
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g.king@gmail.com"
                      className={`pl-9 py-3 bg-white dark:bg-[#2E2E4A] text-[#333333] dark:text-white placeholder:text-[#aaa] dark:placeholder:text-[#666] focus:border-0 focus:shadow-[0_0_8px_2px_#633CFF40]
    ${
      field.state.meta.errors.length
        ? "border-red-500 focus-visible:ring-red-500"
        : ""
    }`}
                    />
                  </div>
                  
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="password">
            {(field) => (
              <div className="space-y-2 relative">
                <Label
                  htmlFor={field.name}
                  className="text-[#333333] dark:text-[#E0E0F0]"
                >
                  Password
                </Label>
                <div className="relative">
                  <LockKeyhole
                    className="absolute top-1/2 -translate-y-1/2 left-3 text-[#737373] dark:text-[#A0A0B8]"
                    size={16}
                  />
                  {field.state.meta.errors.map((error) => (
                    <p
                      key={error?.message}
                      className="text-red-500 text-[10px] absolute right-2 bottom-2"
                    >
                      {error?.message}
                    </p>
                  ))}
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter your password"
                    className={`pl-9 py-3 bg-white dark:bg-[#2E2E4A] text-[#333333] dark:text-white placeholder:text-[#aaa] dark:placeholder:text-[#666] focus:border-0 focus:shadow-[0_0_8px_2px_#633CFF40]
    ${
      field.state.meta.errors.length
        ? "border-red-500 focus-visible:ring-red-500"
        : "border-[#D9D9D9] dark:border-[#3E3E5E]"
    }`}
                  />
                </div>
                
              </div>
            )}
          </form.Field>

          <form.Subscribe>
            {(state) => (
              <Button
                type="submit"
                className="w-full bg-[#633CFF] hover:bg-[#5230d4] text-white px-[27px] py-[11px] font-semibold p-[16px] mt-2"
                disabled={!state.canSubmit || state.isSubmitting}
              >
                {state.isSubmitting ? "Submitting..." : "Login"}
              </Button>
            )}
          </form.Subscribe>
        </form>

        <div className="mt-4 text-center text-[16px] text-[#737373] dark:text-[#A0A0B8]">
          Don't have an account?
          <Button
            variant="link"
            onClick={onSwitchToSignUp}
            className="text-[#633CFF] hover:text-[#5230d4] text-[16px]"
          >
            Create account
          </Button>
        </div>
      </div>
    </div>
  );
}