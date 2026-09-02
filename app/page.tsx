"use client";

import {
  BarChart3,
  ChefHat,
  CircleDollarSign,
  ClipboardCheck,
  Flame,
  LayoutDashboard,
  LogIn,
  MessageSquareWarning,
  Settings,
  Sparkles,
  TrendingUp,
  Utensils,
  Wallet,
} from "lucide-react";

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

export default function Home() {
  return (
    <div className="app">
      {/* PC Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-mark">
            <ChefHat size={21} />
          </div>

          <div>
            <div className="logo-title">餐谋 AI</div>
            <div className="logo-subtitle">懂餐饮，更懂赚钱</div>
          </div>
        </div>

        <nav className="nav">
          <button className="nav-item active">
            <LayoutDashboard />
            经营总览
          </button>

          <button className="nav-item">
            <Utensils />
            菜品分析
          </button>

          <button className="nav-item">
            <Sparkles />
            AI 工具
          </button>

          <button className="nav-item">
            <BarChart3 />
            经营数据
          </button>

          <button className="nav-item">
            <ClipboardCheck />
            AI 报告
          </button>

          <button className="nav-item">
            <Settings />
            门店设置
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="pro-mini">
            <div className="pro-mini-title">升级餐谋 PRO</div>

            <div className="pro-mini-text">
              解锁完整 AI 经营分析，让每一次经营决策都有数据依据。
            </div>

            <button className="pro-mini-button">
              立即升级
            </button>
          </div>

          <a href="/login" className="nav-item">
            <LogIn />
            登录 / 我的账户
          </a>
        </div>
      </aside>

      {/* Main */}
      <main className="main">
        {/* Mobile Header */}
        <div className="mobile-header">
          <div className="mobile-logo">
            <div className="mobile-logo-mark">
              <ChefHat size={18} />
            </div>

            <span>餐谋 AI</span>
          </div>

          <a href="/login">
            <LogIn size={20} />
          </a>
        </div>

        <div className="topbar">
          <div>
            <h1 className="page-title">
              经营总览
            </h1>

            <p className="page-desc">
              今天是经营的第 126 天，看看你的店今天赚得怎么样。
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <button className="store-selector">
              📍 我的餐厅　⌄
            </button>

            <a
              href="/login"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "#171717",
                color: "#fff",
                padding: "10px 15px",
                borderRadius: "9px",
                fontSize: "12px",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              <LogIn size={14} />
              登录 / 注册
            </a>
          </div>
        </div>

        {/* AI Banner */}
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

          <button className="ai-action">
            查看完整诊断 →
          </button>
        </section>

        {/* Stats */}
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

        {/* Chart + Diagnosis */}
        <section className="content-grid">
          <div className="card section-card">
            <div className="section-title">
              <h3>本周营业趋势</h3>
              <span>营业额 / 天</span>
            </div>

            <div className="chart">
              {chartData.map((item, index) => (
                <div
                  className="bar-wrap"
                  key={item.day}
                >
                  <div
                    className={`bar ${
                      index === chartData.length - 1
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
              ))}
            </div>
          </div>

          <div className="card section-card">
            <div className="section-title">
              <h3>AI 经营提醒</h3>
              <span>刚刚更新</span>
            </div>

            <div className="diagnosis-list">
              <div className="diagnosis-item">
                <div className="diagnosis-icon warning">
                  <TrendingUp size={16} />
                </div>

                <div className="diagnosis-content">
                  <strong>套餐利润偏低</strong>

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
                  <MessageSquareWarning size={16} />
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

        {/* Dishes */}
        <section className="card section-card dishes-card">
          <div className="section-title">
            <h3>菜品利润排行榜</h3>
            <span>查看全部 →</span>
          </div>

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

                  <td>{dish.price}</td>

                  <td>{dish.cost}</td>

                  <td>
                    <span className="margin">
                      {dish.margin}
                    </span>
                  </td>

                  <td>{dish.sales}</td>

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
        </section>
      </main>
    </div>
  );
}
