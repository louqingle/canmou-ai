"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  ChefHat,
  Loader2,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((value) => value - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  function normalizePhone(value: string) {
    return value.replace(/\D/g, "").slice(0, 11);
  }

  async function sendCode() {
    setError("");
    setMessage("");

    const cleanPhone = normalizePhone(phone);

    if (!/^1[3-9]\d{9}$/.test(cleanPhone)) {
      setError("请输入正确的中国大陆手机号");
      return;
    }

    setSending(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: `+86${cleanPhone}`,
      });

      if (error) {
        throw error;
      }

      setCountdown(60);
      setMessage("验证码已发送，请注意查收短信");
    } catch (err) {
      const text =
        err instanceof Error ? err.message : "验证码发送失败";

      setError(text);
    } finally {
      setSending(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setError("");
    setMessage("");

    const cleanPhone = normalizePhone(phone);

    if (!/^1[3-9]\d{9}$/.test(cleanPhone)) {
      setError("请输入正确的中国大陆手机号");
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      setError("请输入 6 位验证码");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: `+86${cleanPhone}`,
        token: code,
        type: "sms",
      });

      if (error) {
        throw error;
      }

      if (!data.session) {
        throw new Error("登录状态创建失败，请重新获取验证码");
      }

      window.location.href = "/";
    } catch (err) {
      const text =
        err instanceof Error ? err.message : "登录失败，请稍后重试";

      setError(text);
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
            <div className="auth-logo-subtitle">
              懂餐饮，更懂赚钱
            </div>
          </div>
        </div>

        <div className="auth-heading">
          <h1>登录餐谋 AI</h1>

          <p>
            用手机号登录，开始管理你的餐厅。
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >
          <label>
            手机号

            <input
              type="tel"
              inputMode="numeric"
              placeholder="请输入手机号"
              value={phone}
              onChange={(e) =>
                setPhone(normalizePhone(e.target.value))
              }
              maxLength={11}
              autoComplete="tel"
            />
          </label>

          <label>
            短信验证码

            <div
              style={{
                display: "flex",
                gap: "8px",
                marginTop: "8px",
              }}
            >
              <input
                type="text"
                inputMode="numeric"
                placeholder="请输入 6 位验证码"
                value={code}
                onChange={(e) =>
                  setCode(
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 6)
                  )
                }
                maxLength={6}
                autoComplete="one-time-code"
                style={{
                  marginTop: 0,
                  flex: 1,
                }}
              />

              <button
                type="button"
                onClick={sendCode}
                disabled={sending || countdown > 0}
                style={{
                  width: "112px",
                  flexShrink: 0,
                  border: "1px solid #dededb",
                  borderRadius: "10px",
                  background: "#fff",
                  color:
                    countdown > 0
                      ? "#aaa"
                      : "var(--orange)",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                {sending
                  ? "发送中..."
                  : countdown > 0
                    ? `${countdown}s 后重发`
                    : "获取验证码"}
              </button>
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
                登录中...
              </>
            ) : (
              <>
                <MessageCircle size={17} />
                登录 / 注册
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          首次使用手机号登录会自动创建餐谋 AI 账户。
          <br />
          登录即表示你同意服务条款与隐私政策。
        </div>
      </div>
    </main>
  );
}
