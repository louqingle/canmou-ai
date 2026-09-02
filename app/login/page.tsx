"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  ChefHat,
  Loader2,
  Mail,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [mode, setMode] = useState<"login" | "register">("login");

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        window.location.replace("/");
        return;
      }
    } finally {
      setChecking(false);
    }
  }

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setMessage("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("请输入邮箱");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("请输入正确的邮箱地址");
      return;
    }

    if (password.length < 6) {
      setError("密码至少需要 6 位");
      return;
    }

    setLoading(true);

    try {
      if (mode === "register") {
        const {
          data,
          error: signUpError,
        } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              avatar_url: "",
              restaurant_created: false,
            },
          },
        });

        if (signUpError) {
          throw signUpError;
        }

        // 如果 Supabase 开启了邮箱确认
        if (!data.session) {
          setMessage(
            "注册成功！请检查邮箱并完成验证，然后回来登录。"
          );
          return;
        }

        window.location.replace("/");
        return;
      }

      const {
        data,
        error: signInError,
      } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      if (!data.session) {
        throw new Error(
          "登录状态创建失败，请重新登录"
        );
      }

      // 让 Supabase session 完整写入浏览器后再跳转
      await new Promise((resolve) =>
        setTimeout(resolve, 300)
      );

      window.location.replace("/");
    } catch (err) {
      const text =
        err instanceof Error
          ? err.message
          : "操作失败，请稍后重试";

      if (
        text.includes("Invalid login credentials")
      ) {
        setError(
          "邮箱或密码错误。如果还没有账户，请先注册。"
        );
      } else if (
        text.includes("User already registered")
      ) {
        setError(
          "这个邮箱已经注册，请直接登录。"
        );
      } else if (
        text.includes("Email not confirmed")
      ) {
        setError(
          "邮箱还没有验证，请先去邮箱完成验证。"
        );
      } else {
        setError(text);
      }
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7f7f5",
          color: "#777",
        }}
      >
        正在检查登录状态...
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#fafaf8 0%,#f4f4f1 100%)",
        padding: "24px 16px",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "#666",
            textDecoration: "none",
            fontSize: 13,
            marginBottom: 22,
          }}
        >
          <ArrowLeft size={16} />
          返回首页
        </Link>

        <div
          style={{
            background: "#fff",
            border: "1px solid #e7e7e3",
            borderRadius: 20,
            padding: 26,
            boxShadow:
              "0 15px 45px rgba(0,0,0,.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 28,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "#171717",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ChefHat size={22} />
            </div>

            <div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 850,
                }}
              >
                餐谋 AI
              </div>

              <div
                style={{
                  fontSize: 11,
                  color: "#999",
                }}
              >
                懂餐饮，更懂赚钱
              </div>
            </div>
          </div>

          <h1
            style={{
              margin: "0 0 7px",
              fontSize: 27,
              letterSpacing: "-.6px",
            }}
          >
            {mode === "login"
              ? "登录餐谋 AI"
              : "创建餐谋 AI 账户"}
          </h1>

          <p
            style={{
              margin: "0 0 25px",
              color: "#888",
              fontSize: 13,
            }}
          >
            {mode === "login"
              ? "登录后管理你的餐厅和经营数据。"
              : "创建账户，开始使用餐谋 AI。"}
          </p>

          <form onSubmit={handleSubmit}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 800,
                marginBottom: 16,
              }}
            >
              邮箱

              <div
                style={{
                  position: "relative",
                  marginTop: 8,
                }}
              >
                <Mail
                  size={17}
                  style={{
                    position: "absolute",
                    left: 14,
                    top: 14,
                    color: "#999",
                  }}
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="请输入邮箱"
                  autoComplete="email"
                  disabled={loading}
                  style={{
                    width: "100%",
                    height: 46,
                    boxSizing: "border-box",
                    border:
                      "1px solid #dededb",
                    borderRadius: 11,
                    padding: "0 14px 0 42px",
                    outline: "none",
                    fontSize: 14,
                  }}
                />
              </div>
            </label>

            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 800,
                marginBottom: 16,
              }}
            >
              密码

              <div
                style={{
                  position: "relative",
                  marginTop: 8,
                }}
              >
                <Lock
                  size={17}
                  style={{
                    position: "absolute",
                    left: 14,
                    top: 14,
                    color: "#999",
                  }}
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="至少 6 位密码"
                  autoComplete={
                    mode === "login"
                      ? "current-password"
                      : "new-password"
                  }
                  disabled={loading}
                  style={{
                    width: "100%",
                    height: 46,
                    boxSizing: "border-box",
                    border:
                      "1px solid #dededb",
                    borderRadius: 11,
                    padding: "0 14px 0 42px",
                    outline: "none",
                    fontSize: 14,
                  }}
                />
              </div>
            </label>

            {error && (
              <div
                style={{
                  background: "#fff3f1",
                  color: "#c0392b",
                  padding: "11px 13px",
                  borderRadius: 9,
                  fontSize: 12,
                  marginBottom: 14,
                }}
              >
                {error}
              </div>
            )}

            {message && (
              <div
                style={{
                  background: "#f1f8f3",
                  color: "#287a42",
                  padding: "11px 13px",
                  borderRadius: 9,
                  fontSize: 12,
                  marginBottom: 14,
                }}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                height: 50,
                border: 0,
                borderRadius: 11,
                background: "#171717",
                color: "#fff",
                fontSize: 14,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                cursor: "pointer",
              }}
            >
              {loading ? (
                <>
                  <Loader2
                    size={17}
                    className="spin"
                  />
                  请稍候...
                </>
              ) : mode === "login" ? (
                "登录"
              ) : (
                "注册账户"
              )}
            </button>
          </form>

          <div
            style={{
              textAlign: "center",
              marginTop: 20,
              fontSize: 12,
              color: "#888",
            }}
          >
            {mode === "login"
              ? "还没有账户？"
              : "已经有账户？"}

            <button
              type="button"
              onClick={() => {
                setMode(
                  mode === "login"
                    ? "register"
                    : "login"
                );
                setError("");
                setMessage("");
              }}
              style={{
                border: 0,
                background: "transparent",
                color: "#d95b32",
                fontWeight: 800,
                marginLeft: 4,
                cursor: "pointer",
              }}
            >
              {mode === "login"
                ? "立即注册"
                : "返回登录"}
            </button>
          </div>

          <div
            style={{
              textAlign: "center",
              marginTop: 18,
              color: "#aaa",
              fontSize: 10,
              lineHeight: 1.6,
            }}
          >
            登录即表示你同意服务条款与隐私政策
          </div>
        </div>
      </div>
    </main>
  );
}
