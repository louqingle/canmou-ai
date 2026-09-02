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
  const [avatar, setAvatar] = useState("");
  const [restaurant, setRestaurant] = useState("我的餐厅");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    setEmail(user.email || "");

    const metadata = user.user_metadata || {};

    setName(
      metadata.name ||
        metadata.full_name ||
        "餐饮老板"
    );

    setAvatar(metadata.avatar_url || "");

    setRestaurant(
      metadata.restaurant_name ||
        "我的餐厅"
    );

    setLoading(false);
  }

  async function saveProfile() {
    setSaving(true);
    setMessage("");

    const { error } =
      await supabase.auth.updateUser({
        data: {
          name: name.trim() || "餐饮老板",
          restaurant_name:
            restaurant.trim() || "我的餐厅",
        },
      });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("资料保存成功");
    }

    setSaving(false);
  }

  async function uploadAvatar(
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

      if (typeof result !== "string") return;

      setAvatar(result);

      const { error } =
        await supabase.auth.updateUser({
          data: {
            avatar_url: result,
          },
        });

      if (error) {
        setMessage(
          "头像保存失败：" + error.message
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
      <main className="auth-page">
        <div
          style={{
            textAlign: "center",
            color: "#777",
          }}
        >
          正在加载账户...
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f7f7f5",
        padding: "24px",
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
              gap: "8px",
              color: "#333",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={18} />
            返回经营总览
          </Link>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
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
              <ChefHat size={20} />
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
                  fontSize: "11px",
                  color: "#888",
                }}
              >
                懂餐饮，更懂赚钱
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div style={{ marginBottom: "22px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: 800,
            }}
          >
            我的账户
          </h1>

          <p
            style={{
              marginTop: "7px",
              color: "#777",
              fontSize: "14px",
            }}
          >
            管理你的个人资料、餐厅和账户安全。
          </p>
        </div>

        {/* Profile */}
        <section
          style={{
            background: "#fff",
            border: "1px solid #e8e8e5",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "16px",
          }}
        >
          <h2
            style={{
              margin: "0 0 20px",
              fontSize: "17px",
            }}
          >
            个人资料
          </h2>

          <div
            style={{
              display: "flex",
              gap: "24px",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "82px",
                height: "82px",
                flexShrink: 0,
              }}
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt="用户头像"
                  style={{
                    width: "82px",
                    height: "82px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border:
                      "3px solid #f0f0ed",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "82px",
                    height: "82px",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg,#f0f0ed,#ddd)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "30px",
                    fontWeight: 800,
                    color: "#555",
                  }}
                >
                  {name.charAt(0)}
                </div>
              )}

              <label
                style={{
                  position: "absolute",
                  right: "-3px",
                  bottom: "-3px",
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  background: "#171717",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  border: "3px solid #fff",
                }}
              >
                <Camera size={14} />

                <input
                  type="file"
                  accept="image/*"
                  onChange={uploadAvatar}
                  style={{ display: "none" }}
                />
              </label>
            </div>

            <div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: "17px",
                }}
              >
                {name || "餐饮老板"}
              </div>

              <div
                style={{
                  color: "#888",
                  fontSize: "13px",
                  marginTop: "5px",
                }}
              >
                点击头像右下角按钮更换头像
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: "16px",
            }}
          >
            <label>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  marginBottom: "7px",
                }}
              >
                昵称
              </div>

              <div style={{ position: "relative" }}>
                <User
                  size={16}
                  style={{
                    position: "absolute",
                    left: "13px",
                    top: "14px",
                    color: "#999",
                  }}
                />

                <input
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="例如：张老板"
                  style={{
                    width: "100%",
                    height: "44px",
                    border:
                      "1px solid #dededb",
                    borderRadius: "10px",
                    padding:
                      "0 14px 0 40px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </label>

            <label>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  marginBottom: "7px",
                }}
              >
                登录邮箱
              </div>

              <div style={{ position: "relative" }}>
                <Mail
                  size={16}
                  style={{
                    position: "absolute",
                    left: "13px",
                    top: "14px",
                    color: "#999",
                  }}
                />

                <input
                  value={email}
                  disabled
                  style={{
                    width: "100%",
                    height: "44px",
                    border:
                      "1px solid #dededb",
                    borderRadius: "10px",
                    padding:
                      "0 14px 0 40px",
                    background: "#f7f7f5",
                    color: "#777",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </label>

            <label>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  marginBottom: "7px",
                }}
              >
                我的餐厅
              </div>

              <div style={{ position: "relative" }}>
                <Store
                  size={16}
                  style={{
                    position: "absolute",
                    left: "13px",
                    top: "14px",
                    color: "#999",
                  }}
                />

                <input
                  value={restaurant}
                  onChange={(e) =>
                    setRestaurant(
                      e.target.value
                    )
                  }
                  placeholder="例如：小乐家常菜"
                  style={{
                    width: "100%",
                    height: "44px",
                    border:
                      "1px solid #dededb",
                    borderRadius: "10px",
                    padding:
                      "0 14px 0 40px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </label>
          </div>

          <button
            onClick={saveProfile}
            disabled={saving}
            style={{
              marginTop: "20px",
              height: "44px",
              padding: "0 22px",
              border: 0,
              borderRadius: "10px",
              background: "#171717",
              color: "#fff",
              fontWeight: 700,
              cursor: saving
                ? "not-allowed"
                : "pointer",
            }}
          >
            {saving ? "保存中..." : "保存资料"}
          </button>

          {message && (
            <div
              style={{
                marginTop: "12px",
                fontSize: "13px",
                color: "#777",
              }}
            >
              {message}
            </div>
          )}
        </section>

        {/* PRO */}
        <section
          style={{
            background: "#171717",
            color: "#fff",
            borderRadius: "16px",
            padding: "22px",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "14px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background:
                  "rgba(255,255,255,.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Crown size={21} />
            </div>

            <div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: "15px",
                }}
              >
                餐谋 PRO
              </div>

              <div
                style={{
                  color: "#aaa",
                  fontSize: "12px",
                  marginTop: "4px",
                }}
              >
                解锁完整 AI 经营分析
              </div>
            </div>
          </div>

          <button
            style={{
              border: 0,
              borderRadius: "9px",
              padding: "10px 16px",
              background: "#fff",
              color: "#171717",
              fontWeight: 800,
            }}
          >
            升级 PRO
          </button>
        </section>

        {/* Security */}
        <section
          style={{
            background: "#fff",
            border: "1px solid #e8e8e5",
            borderRadius: "16px",
            padding: "22px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <ShieldCheck size={20} />

            <div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: "15px",
                }}
              >
                账户安全
              </div>

              <div
                style={{
                  color: "#888",
                  fontSize: "12px",
                  marginTop: "4px",
                }}
              >
                你的账户由 Supabase 安全保护。
              </div>
            </div>
          </div>
        </section>

        {/* Logout */}
        <button
          onClick={logout}
          style={{
            width: "100%",
            height: "48px",
            border:
              "1px solid #e1e1de",
            borderRadius: "11px",
            background: "#fff",
            color: "#d33",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <LogOut size={17} />
          退出登录
        </button>
      </div>
    </main>
  );
}
