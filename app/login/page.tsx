"use client";

import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  ChefHat,
  Eye,
  EyeOff,
  Loader2,
  LogIn,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [mode, setMode] = useState<"login" | "register">("login");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setError("");
    setMessage("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("请输入邮箱地址");
      return;
    }

    if (!cleanEmail.includes("@")) {
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

        window.location.href = "/";
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

      if (data.session) {
        window.location.href = "/";
        return;
      }

      setMessage(
        "注册成功！请检查邮箱并完成验证，然后登录。"
      );
    } catch (err) {
      const text =
        err instanceof Error
          ? err.message
          : "操作失败，请稍后重试";

      if (
        text.toLowerCase().includes("invalid login")
      ) {
        setError("邮箱或密码错误");
      } else if (
        text.toLowerCase().includes("already registered")
      ) {
        setError("这个邮箱已经注册，请直接登录");
      } else {
        setError(text);
      }
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setMode((current) =>
      current === "login" ? "register" : "login"
    );

    setError("");
    setMessage("");
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <Link href="/" className="auth-back">
          <ArrowLeft size={16} />
          返回首页
        </Link>

        {/* Logo */}
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

        {/* Heading */}
        <div className="auth-heading">
          <h1>
            {mode === "login"
              ? "登录餐谋 AI"
              : "创建餐谋 AI 账户"}
          </h1>

          <p>
            {mode === "login"
              ? "登录后继续管理你的餐厅。"
              : "注册账户，开始你的餐厅经营分析。"}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >
          <label>
            邮箱

            <input
              type="email"
              placeholder="请输入邮箱地址"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              autoComplete="email"
              disabled={loading}
            />
          </label>

          <label>
            密码

            <div
              style={{
                position: "relative",
                marginTop: "8px",
              }}
            >
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="请输入密码（至少 6 位）"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                autoComplete={
                  mode === "login"
                    ? "current-password"
                    : "new-password"
                }
                disabled={loading}
                style={{
                  marginTop: 0,
                  paddingRight: "48px",
                }}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (value) => !value
                  )
                }
                disabled={loading}
                aria-label={
                  showPassword
                    ? "隐藏密码"
                    : "显示密码"
                }
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                  border: 0,
                  background: "transparent",
                  padding: "6px",
                  color: "#777",
                }}
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </label>

          {/* Forgot password */}
          {mode === "login" && (
            <div
              style={{
                display: "flex",
                justifyContent:
                  "flex-end",
                marginTop: "-4px",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setMessage(
                    "忘记密码功能下一步接入。"
                  )
                }
                style={{
                  border: 0,
                  background: "transparent",
                  color: "var(--orange)",
                  fontSize: "13px",
                  padding: 0,
                }}
              >
                忘记密码？
              </button>
            </div>
          )}

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
                {mode === "login" ? (
                  <LogIn size={17} />
                ) : (
                  <UserPlus size={17} />
                )}

                {mode === "login"
                  ? "登录"
                  : "免费注册"}
              </>
            )}
          </button>
        </form>

        {/* Switch */}
        <div
          style={{
            textAlign: "center",
            marginTop: "22px",
            fontSize: "13px",
            color: "#777",
          }}
        >
          {mode === "login"
            ? "还没有餐谋 AI 账户？"
            : "已经有账户？"}

          <button
            type="button"
            onClick={switchMode}
            style={{
              border: 0,
              background: "transparent",
              color: "var(--orange)",
              fontWeight: 700,
              marginLeft: "5px",
              padding: 0,
            }}
          >
            {mode === "login"
              ? "立即注册"
              : "立即登录"}
          </button>
        </div>

        <div className="auth-footer">
          登录即表示你同意餐谋 AI 的服务条款与隐私政策。
        </div>
      </div>
    </main>
  );
}
