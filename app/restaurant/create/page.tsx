"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  ChefHat,
  MapPin,
  Store,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const categories = [
  "中餐",
  "快餐",
  "烧烤",
  "火锅",
  "面馆",
  "奶茶饮品",
  "西餐",
  "烘焙甜品",
  "小吃",
  "其他",
];

export default function CreateRestaurantPage() {
  const [restaurantName, setRestaurantName] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [dailyOrders, setDailyOrders] = useState("");
  const [averagePrice, setAveragePrice] = useState("");

  const [userEmail, setUserEmail] = useState("");
  const [checking, setChecking] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    setUserEmail(user.email || "");
    setChecking(false);
  }

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!restaurantName.trim()) {
      setError("请输入餐厅名称");
      return;
    }

    if (!category) {
      setError("请选择餐饮类型");
      return;
    }

    if (!city.trim()) {
      setError("请输入所在城市");
      return;
    }

    const orders = Number(dailyOrders);
    const price = Number(averagePrice);

    if (
      dailyOrders &&
      (!Number.isFinite(orders) || orders < 0)
    ) {
      setError("日均订单请输入正确数字");
      return;
    }

    if (
      averagePrice &&
      (!Number.isFinite(price) || price < 0)
    ) {
      setError("平均客单价请输入正确数字");
      return;
    }

    setSaving(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        window.location.href = "/login";
        return;
      }

      /*
       * 第一阶段：
       * 先把餐厅资料保存到 Supabase 用户 metadata。
       *
       * 下一阶段我们会建立 restaurants 表，
       * 再把这里升级成真正的多门店数据库。
       */
      const { error } =
        await supabase.auth.updateUser({
          data: {
            restaurant_name:
              restaurantName.trim(),

            restaurant_category:
              category,

            restaurant_city:
              city.trim(),

            restaurant_address:
              address.trim(),

            daily_orders:
              dailyOrders
                ? orders
                : null,

            average_price:
              averagePrice
                ? price
                : null,

            restaurant_created:
              true,
          },
        });

      if (error) {
        throw error;
      }

      setMessage("餐厅创建成功，正在进入餐谋 AI...");

      setTimeout(() => {
        window.location.href = "/";
      }, 800);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "创建餐厅失败，请稍后重试"
      );
    } finally {
      setSaving(false);
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
          fontSize: "14px",
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
          "linear-gradient(180deg, #fafaf8 0%, #f4f4f1 100%)",
        padding: "24px 16px 60px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "680px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "34px",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              color: "#555",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={16} />
            返回
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
                  fontWeight: 850,
                  fontSize: "15px",
                }}
              >
                餐谋 AI
              </div>

              <div
                style={{
                  fontSize: "10px",
                  color: "#999",
                }}
              >
                懂餐饮，更懂赚钱
              </div>
            </div>
          </div>
        </div>

        {/* Intro */}
        <div
          style={{
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "7px 10px",
              borderRadius: "999px",
              background: "#fff",
              border: "1px solid #e7e7e3",
              color: "#666",
              fontSize: "11px",
              fontWeight: 700,
              marginBottom: "14px",
            }}
          >
            <Store size={13} />
            第一步：建立你的门店
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "30px",
              lineHeight: 1.2,
              letterSpacing: "-0.8px",
              color: "#171717",
            }}
          >
            创建我的餐厅
          </h1>

          <p
            style={{
              margin: "9px 0 0",
              color: "#777",
              fontSize: "14px",
              lineHeight: 1.7,
            }}
          >
            告诉餐谋 AI 一点你的门店信息，
            我们才能给你更准确的经营建议。
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#fff",
            border: "1px solid #e7e7e3",
            borderRadius: "18px",
            padding: "24px",
            boxShadow:
              "0 10px 35px rgba(0,0,0,.04)",
          }}
        >
          {/* Restaurant Name */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 800,
                color: "#222",
                marginBottom: "8px",
              }}
            >
              餐厅名称
              <span
                style={{
                  color: "#e24b35",
                  marginLeft: "3px",
                }}
              >
                *
              </span>
            </label>

            <div style={{ position: "relative" }}>
              <Building2
                size={17}
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "14px",
                  color: "#999",
                }}
              />

              <input
                value={restaurantName}
                onChange={(e) =>
                  setRestaurantName(
                    e.target.value
                  )
                }
                placeholder="例如：小乐家常菜"
                disabled={saving}
                style={{
                  width: "100%",
                  height: "46px",
                  border: "1px solid #dededb",
                  borderRadius: "11px",
                  padding: "0 14px 0 42px",
                  boxSizing: "border-box",
                  outline: "none",
                  fontSize: "14px",
                  color: "#222",
                }}
              />
            </div>
          </div>

          {/* Category */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 800,
                color: "#222",
                marginBottom: "8px",
              }}
            >
              餐饮类型
              <span
                style={{
                  color: "#e24b35",
                  marginLeft: "3px",
                }}
              >
                *
              </span>
            </label>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(5, 1fr)",
                gap: "8px",
              }}
            >
              {categories.map((item) => {
                const active =
                  category === item;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setCategory(item)
                    }
                    disabled={saving}
                    style={{
                      height: "40px",
                      borderRadius: "9px",
                      border: active
                        ? "1px solid #171717"
                        : "1px solid #e3e3df",
                      background: active
                        ? "#171717"
                        : "#fff",
                      color: active
                        ? "#fff"
                        : "#555",
                      fontSize: "12px",
                      fontWeight: active
                        ? 800
                        : 600,
                    }}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* City */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 800,
                color: "#222",
                marginBottom: "8px",
              }}
            >
              所在城市
              <span
                style={{
                  color: "#e24b35",
                  marginLeft: "3px",
                }}
              >
                *
              </span>
            </label>

            <div style={{ position: "relative" }}>
              <MapPin
                size={17}
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "14px",
                  color: "#999",
                }}
              />

              <input
                value={city}
                onChange={(e) =>
                  setCity(e.target.value)
                }
                placeholder="例如：无锡市"
                disabled={saving}
                style={{
                  width: "100%",
                  height: "46px",
                  border: "1px solid #dededb",
                  borderRadius: "11px",
                  padding: "0 14px 0 42px",
                  boxSizing: "border-box",
                  outline: "none",
                  fontSize: "14px",
                }}
              />
            </div>
          </div>

          {/* Address */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 800,
                color: "#222",
                marginBottom: "8px",
              }}
            >
              门店地址
              <span
                style={{
                  color: "#aaa",
                  fontWeight: 500,
                  marginLeft: "6px",
                }}
              >
                可选
              </span>
            </label>

            <input
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
              placeholder="例如：梁溪区人民中路 88 号"
              disabled={saving}
              style={{
                width: "100%",
                height: "46px",
                border: "1px solid #dededb",
                borderRadius: "11px",
                padding: "0 14px",
                boxSizing: "border-box",
                outline: "none",
                fontSize: "14px",
              }}
            />
          </div>

          {/* Numbers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 800,
                  marginBottom: "8px",
                }}
              >
                日均订单
                <span
                  style={{
                    color: "#aaa",
                    fontWeight: 500,
                    marginLeft: "6px",
                  }}
                >
                  可选
                </span>
              </label>

              <input
                type="number"
                min="0"
                value={dailyOrders}
                onChange={(e) =>
                  setDailyOrders(
                    e.target.value
                  )
                }
                placeholder="例如 200"
                disabled={saving}
                style={{
                  width: "100%",
                  height: "46px",
                  border:
                    "1px solid #dededb",
                  borderRadius: "11px",
                  padding: "0 14px",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 800,
                  marginBottom: "8px",
                }}
              >
                平均客单价
                <span
                  style={{
                    color: "#aaa",
                    fontWeight: 500,
                    marginLeft: "6px",
                  }}
                >
                  可选
                </span>
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={averagePrice}
                onChange={(e) =>
                  setAveragePrice(
                    e.target.value
                  )
                }
                placeholder="例如 35"
                disabled={saving}
                style={{
                  width: "100%",
                  height: "46px",
                  border:
                    "1px solid #dededb",
                  borderRadius: "11px",
                  padding: "0 14px",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                padding: "11px 13px",
                borderRadius: "9px",
                background: "#fff3f1",
                color: "#c0392b",
                fontSize: "12px",
                marginBottom: "14px",
              }}
            >
              {error}
            </div>
          )}

          {/* Success */}
          {message && (
            <div
              style={{
                padding: "11px 13px",
                borderRadius: "9px",
                background: "#f1f8f3",
                color: "#287a42",
                fontSize: "12px",
                marginBottom: "14px",
              }}
            >
              {message}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            style={{
              width: "100%",
              height: "50px",
              border: 0,
              borderRadius: "11px",
              background: "#171717",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              cursor: saving
                ? "not-allowed"
                : "pointer",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving
              ? "正在创建..."
              : "创建我的餐厅"}

            {!saving && (
              <ArrowRight size={17} />
            )}
          </button>

          <div
            style={{
              marginTop: "13px",
              textAlign: "center",
              fontSize: "11px",
              color: "#aaa",
            }}
          >
            当前登录账户：{userEmail}
          </div>
        </form>

        {/* Bottom */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "7px",
            marginTop: "18px",
            color: "#999",
            fontSize: "11px",
          }}
        >
          <Utensils size={13} />
          后续可以继续添加菜品、成本、营业额和经营数据
        </div>
      </div>
    </main>
  );
}
