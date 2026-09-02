"use client";

import { FormEvent, useState } from "react";
import { ChefHat, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email || !password) {
      setError("请输入邮箱和密码");
      return;
    }

    if (password.length < 6) {
      setError("密码至少需要 6 位");
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (error) {
          throw error;
        }

        if (data.session) {
          window.location.href = "/";
        } else {
          setMessage("注册成功，请检查邮箱完成验证，然后登录。");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          throw error;
        }

        window.location.href = "/";
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "操作失败，请稍后重试";

      if (errorMessage.toLowerCase().includes("invalid login")) {
        setError("邮箱或密码错误");
      } else if (errorMessage.toLowerCase().includes("already registered")) {
        setError("这个邮箱已经注册过了，请直接登录");
      } else {
        setError(errorMessage);
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
            <div className="auth-logo-title">餐谋 AI</div>
            <div className="auth-logo-subtitle">懂餐饮，更懂赚钱</div>
          </div>
        </div>

        <div className="auth-heading">
          <h1>{isRegister ? "创建你的餐谋账户" : "欢迎回来"}</h1>
          <p>
            {isRegister
              ? "从今天开始，让 AI 帮你经营餐厅。"
              : "登录后继续管理你的餐厅。"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            邮箱
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>

          <label>
            密码
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="至少 6 位密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isRegister ? "new-password" : "current-password"}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "隐藏密码" : "显示密码"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          {error && <div className="auth-message error">{error}</div>}

          {message && (
            <div className="auth-message success">{message}</div>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={17} className="spin" />
                请稍候...
              </>
            ) : isRegister ? (
              "创建账户"
            ) : (
              "登录餐谋 AI"
            )}
          </button>
        </form>

        <div className="auth-switch">
          {isRegister ? "已经有账户？" : "还没有餐谋账户？"}

          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
              setMessage("");
            }}
          >
            {isRegister ? "立即登录" : "免费注册"}
          </button>
        </div>

        <div className="auth-footer">
          注册即表示你同意餐谋 AI 的服务条款与隐私政策。
        </div>
      </div>
    </main>
  );
}
