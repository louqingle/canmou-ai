"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Camera,
  ChefHat,
  Crown,
  LogOut,
  Mail,
  ShieldCheck,
  Store,
  User,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AccountPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [avatar, setAvatar] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadAccount();
  }, []);

  async function loadAccount() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const metadata = user.user_metadata || {};

    setEmail(user.email || "");

    setName(
      metadata.name ||
        metadata.full_name ||
        "餐饮老板"
    );

    setRestaurant(
      metadata.restaurant_name ||
        "我的餐厅"
    );

    setAvatar(
      metadata.avatar_url || ""
    );

    setLoading(false);
  }

  async function saveAccount() {
    setSaving(true);
    setMessage("");

    const { error } =
      await supabase.auth.updateUser({
        data: {
          name:
            name.trim() || "餐饮老板",
          restaurant_name:
            restaurant.trim() || "我的餐厅",
        },
      });

    if (error) {
      setMessage(
        "保存失败：" + error.message
      );
    } else {
      setMessage("保存成功");
    }

    setSaving(false);
  }

  function handleAvatar(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("请选择图片文件");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("头像不能超过 5MB");
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      const result = reader.result;

      if (typeof result !== "string") {
        return;
      }

      setAvatar(result);

      const { error } =
        await supabase.auth.updateUser({
          data: {
            avatar_url: result,
          },
        });

      if (error) {
        setMessage(
          "头像保存失败：" +
            error.message
        );
      } else {
        setMessage("头像更新成功");
      }
    };

    reader.readAsDataURL(file);
  }

  async function logout() {
    await supabase.auth.signOut();

    window.location.href = "/login";
  }

  if (loading) {
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
        正在加载账户...
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f7f7f5",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "28px",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              color: "#333",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={17} />
            返回经营总览
          </Link>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "9px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "#171717",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ChefHat size={19} />
            </div>

            <div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: "15px",
                }}
              >
                餐谋 AI
              </div>

              <div
                style={{
                  color: "#999",
                  fontSize: "10px",
