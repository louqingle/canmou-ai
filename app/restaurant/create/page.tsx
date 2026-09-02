"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  ChefHat,
  Loader2,
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
  const [monthlyRevenue, setMonthlyRevenue] = useState("");

  const [userEmail, setUserEmail] = useState("");
  const [checking, setChecking] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      if (!user) {
        window.location.href = "/login";
        return;
      }

      setUserEmail(user.email || "");
      setChecking(false);
    } catch (err) {
      console.error(err);
      window.location.href = "/login";
    }
  }

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setMessage("");

    const name = restaurantName.trim();
    const cityName = city.trim();
    const restaurantAddress = address.trim();

    if (!name) {
      setError("请输入餐厅名称");
      return;
    }

    if (!category) {
      setError("请选择餐饮类型");
      return;
    }

    if (!cityName) {
      setError("请输入所在城市");
      return;
    }

    const orders =
      dailyOrders.trim() === ""
        ? 0
        : Number(dailyOrders);

    const price =
      averagePrice.trim() === ""
        ? 0
        : Number(averagePrice);

    const revenue =
      monthlyRevenue.trim() === ""
        ? 0
        : Number(monthlyRevenue);

    if (
      !Number.isFinite(orders) ||
      orders < 0
    ) {
      setError("日均订单请输入正确数字");
      return;
    }

    if (
      !Number.isFinite(price) ||
      price < 0
    ) {
      setError("平均客单价请输入正确数字");
      return;
    }

    if (
      !Number.isFinite(revenue) ||
      revenue < 0
    ) {
      setError("月营业额请输入正确数字");
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
       * 检查当前用户是否已经有餐厅
       */
      const {
        data: existingRestaurant,
        error: existingError,
      } = await supabase
        .from("restaurants")
        .select("id")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();

      if (existingError) {
        throw existingError;
      }

      /*
       * 如果已经有餐厅：
       * 更新现有餐厅
       */
      if (existingRestaurant) {
        const { error: updateError } =
          await supabase
            .from("restaurants")
            .update({
              name,
              category,
              city: cityName,
              address: restaurantAddress,
              daily_orders: orders,
              average_price: price,
              monthly_revenue: revenue,
              updated_at: new Date().toISOString(),
            })
            .eq(
              "id",
              existingRestaurant.id
            );

        if (updateError) {
          throw updateError;
        }
      } else {
        /*
         * 第一次创建餐厅
         */
        const { error: insertError } =
          await supabase
            .from("restaurants")
            .insert({
              user_id: user.id,
              name,
              category,
              city: cityName,
              address: restaurantAddress,
              daily_orders: orders,
              average_price: price,
              monthly_revenue: revenue,
            });

        if (insertError) {
          throw insertError;
        }
      }

      /*
       * 同时写入 metadata，
       * 用于兼容旧版本页面。
       */
      const { error: metadataError } =
        await supabase.auth.updateUser({
          data: {
            restaurant_name: name,
            restaurant_category: category,
            restaurant_city: cityName,
            restaurant_address:
              restaurantAddress,
            daily_orders: orders,
            average_price: price,
            monthly_revenue: revenue,
            restaurant_created: true,
          },
        });

      if (metadataError) {
        console.warn(
          "用户资料同步失败：",
          metadataError
        );
      }

      setMessage(
        "餐厅创建成功，正在进入餐谋 AI..."
      );

      setTimeout(() => {
        window.location.href = "/";
      }, 800);
    } catch (err) {
      console.error(err);

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

        {/* Form */}
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
          {/* Name */}
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
                  border:
                    "1px solid #dededb",
                  borderRadius: "11px",
                  padding:
                    "0 14px 0 42px",
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
                      cursor: saving
                        ? "not-allowed"
                        : "pointer",
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
                  border:
                    "1px solid #dededb",
                  borderRadius: "11px",
                  padding:
                    "0 14px 0 42px",
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
                border:
                  "1px solid #dededb",
                borderRadius: "11px",
                padding: "0 14px",
                boxSizing: "border-box",
                outline: "none",
                fontSize: "14px",
              }}
            />
          </div>

          {/* Orders + Price */}
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

          {/* Monthly Revenue */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 800,
                marginBottom: "8px",
              }}
            >
              月营业额
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
              value={monthlyRevenue}
              onChange={(e) =>
                setMonthlyRevenue(
                  e.target.value
                )
              }
              placeholder="例如 100000"
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
                fontSize: "14px",
              }}
            />
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
            {saving ? (
              <>
                <Loader2
                  size={17}
                  style={{
                    animation:
                      "spin 1s linear infinite",
                  }}
                />
                正在保存...
              </>
            ) : (
              <>
                创建我的餐厅
                <ArrowRight size={17} />
              </>
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
          餐谋 AI 会根据你的门店数据生成经营建议
        </div>
      </div>
    </main>
  );
}
