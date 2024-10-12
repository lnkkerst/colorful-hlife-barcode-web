"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { MdAccountBox, MdPassword } from "react-icons/md";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { tokenStorageKey } from "@/utils/constants";

const LoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

type LoginSchemaType = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const onSubmit = handleSubmit(async ({ username, password }) => {
    setIsLoggingIn(true);
    setErrorMessage("");

    const response = await fetch(
      "https://api.hlife365.cn/hlifeuser/login/v1.0",
      {
        method: "POST",
        headers: {
          "user-agent":
            "ColorfulSchool/2.1.0 (M2012K11AG; Android 13; Scale/3.00)",
          "content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          loginAccount: username,
          password,
        }),
      },
    );

    const json = await response.json();

    const result = z
      .object({
        body: z.object({
          accessToken: z.string(),
        }),
      })
      .safeParse(json);

    if (!result.success) {
      if (json?.code === 10005) {
        setErrorMessage("登录失败，账号或密码错误");
      } else {
        setErrorMessage("登录失败，未知错误");
      }
      setIsLoggingIn(false);
      return;
    }

    localStorage.setItem(tokenStorageKey, result.data.body.accessToken);
    router.replace("/");
  });

  return (
    <div className="min-h-dvh min-w-screen flex items-center justify-center">
      <div className="w-3/4 max-w-[360px]">
        <form onSubmit={onSubmit}>
          <label className="form-control">
            <label
              className={clsx(
                "input input-bordered",
                "flex items-center gap-2",
              )}
            >
              <MdAccountBox className="h-6 w-6 opacity-70" />
              <input
                type="text"
                autoComplete="username"
                className="grow"
                placeholder="用户名"
                {...register("username")}
              />
            </label>
            <div className="label">
              <span className="label-text-alt text-error">
                {errors.username?.message}
              </span>
            </div>
          </label>

          <label className="form-control">
            <label
              className={clsx(
                "input input-bordered",
                "flex items-center gap-2",
              )}
            >
              <MdPassword className="h-6 w-6 opacity-70" />
              <input
                type="password"
                autoComplete="current-password"
                className="grow"
                placeholder="密码"
                {...register("password")}
              />
            </label>
            <div className="label">
              <span
                className="label-text-alt
                 text-error"
              >
                {errors.password?.message}
              </span>
            </div>
          </label>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoggingIn}
          >
            登录
          </button>

          <div className="text-error text-center text-sm h-8 mt-4">
            {errorMessage}
          </div>
        </form>
      </div>
    </div>
  );
}
