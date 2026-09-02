"use client";

import { FormEvent, useState } from "react";
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
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setError("");
    setMessage("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setError("请输入正确的邮箱地址");
      return;
    }

    if (password.length < 6) {
      setError("密码至少需要 6 位");
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        const { data, error } =
          await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password,
          });

        if (error) {
          throw error;
        }

        if (!data.session) {
          throw new Error("登录状态创建失败，请重新登录");
        }

        /*
         * 登录成功后先进入创建餐厅页面。
         * 后面我们会增加：
         * 已有餐厅 → 首页
         * 没有餐厅 → 创建餐厅
         */
        window.location.href = "/restaurant/create";
        return;
      }

      const { data, error } =
        await supabase.auth.signUp({
          email: cleanEmail,
          password,
        });

      if (error) {
        throw error;
      }

      /*
       * 如果 Supabase 开启了邮箱验证，
       * 这里不会立即产生 session。
       */
      if (!data.session) {
        setMessage(
          "注册成功！请先打开邮箱，点击验证链接，然后回来登录。"
        );
        setMode("login");
        return;
      }

      window.location.href = "/restaurant/create";
    } catch (err) {
      const text =
        err instanceof Error
          ? err.message
          : "操作失败，请稍后重试";

      if (
        text.includes("Invalid login credentials")
      ) {
        setError("邮箱或密码错误");
      } else if (
        text.includes("User already registered")
      ) {
        setError("这个邮箱已经注册，请直接登录");
        setMode("login");
      } else if (
        text.includes("Password should be at least")
      ) {
        setError("密码至少需要 6 位");
      } else {
        setError(text);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">

        <Link href="/" className="auth-back">
          <ArrowLeft size={16} />
          返回首页
        </Link>

        <div className="auth-logo">
          <div className="auth-logo-mark">
            <ChefHat size={25} />
          </div>

          <div>
            <div className="auth-logo-title">
              餐谋 AI
            </div>

            <div className="auth-logo-subtitle">
              懂餐饮，更懂赚钱
            </div>
          </div>
        </div>

        <div className="auth-heading">
          <h1>
            {mode === "login"
              ? "登录餐谋 AI"
              : "创建餐谋 AI 账户"}
          </h1>

          <p>
            {mode === "login"
              ? "登录后管理你的餐厅经营数据。"
              : "创建账户，开始管理你的餐厅。"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >

          <label>
            邮箱

            <div className="input-with-icon">
              <Mail size={17} />

              <input
                type="email"
                placeholder="请输入邮箱"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                autoComplete="email"
              />
            </div>
          </label>

          <label>
            密码

            <div className="input-with-icon">
              <Lock size={17} />

              <input
                type="password"
                placeholder="至少 6 位密码"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                autoComplete={
                  mode === "login"
                    ? "current-password"
                    : "new-password"
                }
              />
            </div>
          </label>

          {error && (
            <div className="auth-message error">
              {error}
            </div>
          )}

          {message && (
            <div className="auth-message success">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2
                  size={17}
                  className="spin"
                />
                {mode === "login"
                  ? "登录中..."
                  : "注册中..."}
              </>
            ) : (
              <>
                {mode === "login"
                  ? "登录"
                  : "创建账户"}
              </>
            )}
          </button>
        </form>

        <div className="auth-switch">
          {mode === "login" ? (
            <>
              还没有账户？

              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError("");
                  setMessage("");
                }}
              >
                免费注册
              </button>
            </>
          ) : (
            <>
              已经有账户？

              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                  setMessage("");
                }}
              >
                返回登录
              </button>
            </>
          )}
        </div>

        <div className="auth-footer">
          登录即表示你同意餐谋 AI
          的服务条款与隐私政策。
        </div>

      </div>
    </main>
  );
}
