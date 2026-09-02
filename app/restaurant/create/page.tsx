"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  ChefHat,
  CircleDollarSign,
  ClipboardCheck,
  Flame,
  LayoutDashboard,
  MessageSquareWarning,
  Settings,
  Sparkles,
  TrendingUp,
  User,
  Utensils,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const stats = [
  {
    label: "今日营业额",
    value: "¥8,326",
    change: "↑ 12.8%",
    icon: CircleDollarSign,
    type: "up",
  },
  {
    label: "今日订单",
    value: "286",
    change: "↑ 8.4%",
    icon: ClipboardCheck,
    type: "up",
  },
  {
    label: "客单价",
    value: "¥29.11",
    change: "↑ 4.1%",
    icon: Wallet,
    type: "up",
  },
  {
    label: "预计毛利率",
    value: "58.2%",
    change: "↓ 3.6%",
    icon: TrendingUp,
    type: "down",
  },
];

const dishes = [
  {
    name: "招牌香辣鸡",
    price: "¥32",
    cost: "¥11.2",
    margin: "65.0%",
    sales: "186",
    tag: "利润爆款",
    tagType: "hot",
  },
  {
    name: "黑椒牛柳饭",
    price: "¥28",
    cost: "¥10.5",
    margin: "62.5%",
    sales: "142",
    tag: "主推",
    tagType: "good",
  },
  {
    name: "双人超值套餐",
    price: "¥58",
    cost: "¥32.4",
    margin: "44.1%",
    sales: "96",
    tag: "优化",
    tagType: "warn",
  },
  {
    name: "酸辣汤",
    price: "¥12",
    cost: "¥8.1",
    margin: "32.5%",
    sales: "51",
    tag: "低利润",
    tagType: "warn",
  },
];

const chartData = [
  { day: "周一", value: 54 },
  { day: "周二", value: 68 },
  { day: "周三", value: 61 },
  { day: "周四", value: 76 },
  { day: "周五", value: 82 },
  { day: "周六", value: 96 },
  { day: "今天", value: 88 },
];

type Restaurant = {
  id: string;
  name: string;
  category: string | null;
  city: string | null;
  address: string | null;
  daily_orders: number | null;
  average_price: number | null;
};

export default function Home() {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [restaurant, setRestaurant] =
    useState<Restaurant | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadRestaurant() {
      try {
        /*
         * ① 获取当前登录用户
         */
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (!mounted) return;

        if (userError || !user) {
          router.replace("/login");
          return;
        }

        /*
         * ② 直接从 restaurants 表查询当前用户的餐厅
         *
         * 不再使用：
         * user.user_metadata.restaurant_created
         *
         * 这是这次修复的核心。
         */
        const {
          data,
          error: restaurantError,
        } = await supabase
          .from("restaurants")
          .select(
            `
              id,
              name,
              category,
              city,
              address,
              daily_orders,
              average_price
            `
          )
          .eq("user_id", user.id)
          .order("created_at", {
            ascending: false,
          })
          .limit(1)
          .maybeSingle();

        if (!mounted) return;

        /*
         * ③ 查询数据库出错
         */
        if (restaurantError) {
          console.error(
            "读取餐厅失败：",
            restaurantError
          );

          setChecking(false);

          return;
        }

        /*
         * ④ 用户还没有餐厅
         *
         * 进入创建餐厅页面
         */
        if (!data) {
          router.replace(
            "/restaurant/create"
          );

          return;
        }

        /*
         * ⑤ 找到了餐厅
         */
        setRestaurant(data);

        setChecking(false);
      } catch (error) {
        console.error(
          "加载餐厅发生错误：",
          error
        );

        if (mounted) {
          setChecking(false);
        }
      }
    }

    loadRestaurant();

    /*
     * 监听登录状态
     */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          router.replace("/login");
        }

        /*
         * 登录完成以后重新读取餐厅
         */
        if (
          event === "SIGNED_IN" ||
          event === "TOKEN_REFRESHED"
        ) {
          loadRestaurant();
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  /*
   * 加载中
   */
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
        正在加载餐厅...
      </main>
    );
  }

  /*
   * 理论上不会进入这里
   * 因为没有餐厅时已经跳转创建页面
   */
  if (!restaurant) {
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
        正在进入餐厅创建页面...
      </main>
    );
  }

  return (
    <div className="app">
      {/* =========================
          Sidebar
      ========================== */}

      <aside className="sidebar">
        <div className="logo">
          <div className="logo-mark">
            <ChefHat size={21} />
          </div>

          <div>
            <div className="logo-title">
              餐谋 AI
            </div>

            <div className="logo-subtitle">
              懂餐饮，更懂赚钱
            </div>
          </div>
        </div>

        <nav className="nav">
          <button
            className="nav-item active"
            type="button"
          >
            <LayoutDashboard />
            经营总览
          </button>

          <button
            className="nav-item"
            type="button"
          >
            <Utensils />
            菜品分析
          </button>

          <button
            className="nav-item"
            type="button"
          >
            <Sparkles />
            AI 工具
          </button>

          <button
            className="nav-item"
            type="button"
          >
            <BarChart3 />
            经营数据
          </button>

          <button
            className="nav-item"
            type="button"
          >
            <ClipboardCheck />
            AI 报告
          </button>

          <button
            className="nav-item"
            type="button"
            onClick={() =>
              router.push(
                "/restaurant/create"
              )
            }
          >
            <Settings />
            门店设置
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="pro-mini">
            <div className="pro-mini-title">
              升级餐谋 PRO
            </div>

            <div className="pro-mini-text">
              解锁完整 AI 经营分析，让每一次经营决策都有数据依据。
            </div>

            <button
              className="pro-mini-button"
              type="button"
            >
              立即升级
            </button>
          </div>

          <button
            className="nav-item"
            type="button"
            onClick={() =>
              router.push("/account")
            }
          >
            <User />
            我的账户
          </button>
        </div>
      </aside>

      {/* =========================
          Main
      ========================== */}

      <main className="main">
        {/* Mobile Header */}

        <div className="mobile-header">
          <div className="mobile-logo">
            <div className="mobile-logo-mark">
              <ChefHat size={18} />
            </div>

            <span>餐谋 AI</span>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push("/account")
            }
            style={{
              border: 0,
              background: "transparent",
              cursor: "pointer",
              padding: 4,
              display: "flex",
              alignItems: "center",
            }}
          >
            <User size={20} />
          </button>
        </div>

        {/* Topbar */}

        <div className="topbar">
          <div>
            <h1 className="page-title">
              经营总览
            </h1>

            <p className="page-desc">
              {restaurant.name}

              {restaurant.city
                ? ` · ${restaurant.city}`
                : ""}

              {restaurant.category
                ? ` · ${restaurant.category}`
                : ""}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <button
              className="store-selector"
              type="button"
              onClick={() =>
                router.push(
                  "/restaurant/create"
                )
              }
            >
              📍 {restaurant.name}　⌄
            </button>

            <button
              type="button"
              onClick={() =>
                router.push("/account")
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "#171717",
                color: "#fff",
                padding: "10px 15px",
                borderRadius: "9px",
                border: 0,
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <User size={14} />
              我的账户
            </button>
          </div>
        </div>

        {/* =========================
            Restaurant Info
        ========================== */}

        <section
          style={{
            marginBottom: "18px",
            padding: "18px 20px",
            background: "#fff",
            border: "1px solid #e7e7e3",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "15px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "13px",
            }}
          >
            <div
              style={{
                width: "45px",
                height: "45px",
                borderRadius: "12px",
                background: "#171717",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ChefHat size={22} />
            </div>

            <div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 850,
                  color: "#171717",
                }}
              >
                {restaurant.name}
              </div>

              <div
                style={{
                  marginTop: "4px",
                  fontSize: "11px",
                  color: "#999",
                }}
              >
                {restaurant.city ||
                  "未填写城市"}

                {" · "}

                {restaurant.category ||
                  "未填写类型"}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/restaurant/create"
              )
            }
            style={{
              border: "1px solid #dededb",
              background: "#fff",
              borderRadius: "9px",
              padding: "9px 13px",
              fontSize: "11px",
              fontWeight: 700,
              color: "#555",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            编辑餐厅
          </button>
        </section>

        {/* =========================
            AI Banner
        ========================== */}

        <section className="ai-banner">
          <div className="ai-label">
            <Sparkles size={15} />
            餐谋 AI 今日诊断
          </div>

          <h2>
            营业额上涨 12.8%，但预计利润下降 3.6%
          </h2>

          <p>
            AI 分析发现：今天高折扣套餐订单占比上升，同时高毛利菜品销量下降。
            建议减少低毛利套餐曝光，并把「招牌香辣鸡」设置为主推菜。
          </p>

          <button
            className="ai-action"
            type="button"
          >
            查看完整诊断 →
          </button>
        </section>

        {/* =========================
            Stats
        ========================== */}

        <section className="stats-grid">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                className="card stat-card"
                key={stat.label}
              >
                <div className="stat-head">
                  <span>{stat.label}</span>
                  <Icon size={16} />
                </div>

                <div className="stat-value">
                  {stat.value}
                </div>

                <div
                  className={`stat-change ${
                    stat.type === "up"
                      ? "up"
                      : "down"
                  }`}
                >
                  {stat.change} 较昨日
                </div>
              </div>
            );
          })}
        </section>

        {/* =========================
            Chart + Diagnosis
        ========================== */}

        <section className="content-grid">
          <div className="card section-card">
            <div className="section-title">
              <h3>本周营业趋势</h3>

              <span>
                营业额 / 天
              </span>
            </div>

            <div className="chart">
              {chartData.map(
                (item, index) => (
                  <div
                    className="bar-wrap"
                    key={item.day}
                  >
                    <div
                      className={`bar ${
                        index ===
                        chartData.length - 1
                          ? "today"
                          : ""
                      }`}
                      style={{
                        height: `${item.value}%`,
                      }}
                    />

                    <span className="bar-label">
                      {item.day}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="card section-card">
            <div className="section-title">
              <h3>AI 经营提醒</h3>

              <span>
                刚刚更新
              </span>
            </div>

            <div className="diagnosis-list">
              <div className="diagnosis-item">
                <div className="diagnosis-icon warning">
                  <TrendingUp size={16} />
                </div>

                <div className="diagnosis-content">
                  <strong>
                    套餐利润偏低
                  </strong>

                  <p>
                    双人套餐毛利率仅 44.1%，建议重新计算优惠力度。
                  </p>
                </div>
              </div>

              <div className="diagnosis-item">
                <div className="diagnosis-icon good">
                  <Flame size={16} />
                </div>

                <div className="diagnosis-content">
                  <strong>
                    招牌香辣鸡表现优秀
                  </strong>

                  <p>
                    销量和利润同时领先，建议增加首页及门店曝光。
                  </p>
                </div>
              </div>

              <div className="diagnosis-item">
                <div className="diagnosis-icon danger">
                  <MessageSquareWarning
                    size={16}
                  />
                </div>

                <div className="diagnosis-content">
                  <strong>
                    差评出现集中趋势
                  </strong>

                  <p>
                    最近 7 条差评中，有 4 条提到出餐速度。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            Dishes
        ========================== */}

        <section className="card section-card dishes-card">
          <div className="section-title">
            <h3>
              菜品利润排行榜
            </h3>

            <button
              type="button"
              style={{
                border: 0,
                background: "transparent",
                color: "#777",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              查看全部 →
            </button>
          </div>

          <div
            style={{
              width: "100%",
              overflowX: "auto",
            }}
          >
            <table className="dish-table">
              <thead>
                <tr>
                  <th>菜品</th>
                  <th>售价</th>
                  <th>成本</th>
                  <th>毛利率</th>
                  <th>销量</th>
                  <th>AI 判断</th>
                </tr>
              </thead>

              <tbody>
                {dishes.map((dish) => (
                  <tr key={dish.name}>
                    <td>
                      <span className="dish-name">
                        {dish.name}
                      </span>
                    </td>

                    <td>
                      {dish.price}
                    </td>

                    <td>
                      {dish.cost}
                    </td>

                    <td>
                      <span className="margin">
                        {dish.margin}
                      </span>
                    </td>

                    <td>
                      {dish.sales}
                    </td>

                    <td>
                      <span
                        className={`badge ${dish.tagType}`}
                      >
                        {dish.tag}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
