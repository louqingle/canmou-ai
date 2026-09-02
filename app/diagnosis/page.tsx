"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Wallet,
  Target,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Lightbulb,
  BarChart3,
  Utensils,
} from "lucide-react";

export default function DiagnosisPage() {
  const metrics = [
    {
      title: "今日营业额",
      value: "¥8,326",
      change: "+12.8%",
      positive: true,
      icon: DollarSign,
    },
    {
      title: "今日订单",
      value: "286",
      change: "+8.4%",
      positive: true,
      icon: ShoppingBag,
    },
    {
      title: "客单价",
      value: "¥29.11",
      change: "+4.1%",
      positive: true,
      icon: Wallet,
    },
    {
      title: "预计毛利率",
      value: "58.2%",
      change: "-3.6%",
      positive: false,
      icon: TrendingDown,
    },
  ];

  const problems = [
    {
      level: "高",
      title: "低毛利套餐订单占比上升",
      description:
        "今日高折扣套餐订单占比明显增加，虽然带来了订单增长，但压缩了整体利润空间。",
      impact: "预计每天少赚 ¥120～¥180",
    },
    {
      level: "中",
      title: "高毛利菜品销量下降",
      description:
        "「招牌香辣鸡」等高毛利单品曝光不足，销量相比昨日下降约 8%。",
      impact: "预计每天少赚 ¥60～¥100",
    },
    {
      level: "中",
      title: "平台成本偏高",
      description:
        "当前平台相关成本约占营业额 15%，可以通过优化套餐和客单价降低影响。",
      impact: "可优化 ¥50～¥90/天",
    },
  ];

  const suggestions = [
    {
      number: "01",
      title: "把「招牌香辣鸡」设置为主推菜",
      description:
        "提高首页曝光，并放在套餐和推荐位第一位。该菜品毛利率约 65.6%，高于店铺平均水平。",
      expected: "预计增加利润 ¥80～¥120/天",
    },
    {
      number: "02",
      title: "降低低毛利套餐曝光",
      description:
        "暂时减少低毛利双人套餐的推荐权重，把流量导向高毛利单品组合。",
      expected: "预计增加利润 ¥50～¥80/天",
    },
    {
      number: "03",
      title: "提高低价套餐客单价",
      description:
        "建议将部分 ¥19.9 / ¥29.9 套餐增加高毛利小食或饮品，提高整体客单价。",
      expected: "预计增加利润 ¥50～¥80/天",
    },
  ];

  const dishes = [
    {
      name: "招牌香辣鸡",
      price: "¥32",
      cost: "¥11",
      margin: "65.6%",
      sales: "86",
      status: "主推",
      good: true,
    },
    {
      name: "番茄鸡蛋饭",
      price: "¥18",
      cost: "¥9",
      margin: "50.0%",
      sales: "42",
      status: "保留",
      good: true,
    },
    {
      name: "超值双人餐",
      price: "¥49",
      cost: "¥31",
      margin: "36.7%",
      sales: "63",
      status: "调价",
      good: false,
    },
    {
      name: "香辣鸡腿饭",
      price: "¥26",
      cost: "¥13",
      margin: "50.0%",
      sales: "38",
      status: "正常",
      good: true,
    },
  ];

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#171717]">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-[#f7f7f5]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-[1100px] items-center justify-between px-5">
          <Link
            href="/restaurant"
            className="flex items-center gap-2 text-[15px] font-medium text-[#666] transition hover:text-black"
          >
            <ArrowLeft size={19} />
            <span>返回经营总览</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ff6b35] text-white">
              <Sparkles size={19} />
            </div>
            <span className="font-bold">餐谋 AI</span>
          </div>

          <div className="w-[90px]" />
        </div>
      </header>

      <div className="mx-auto max-w-[1100px] px-5 pb-16 pt-8">
        {/* 页面标题 */}
        <section className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-[#ff6b35]">
            <Sparkles size={20} />
            <span className="font-semibold">餐谋 AI · 今日诊断</span>
          </div>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-[34px] font-bold tracking-[-1.5px] md:text-[42px]">
                今日经营诊断
              </h1>
              <p className="mt-2 text-[16px] text-[#777]">
                小乐黄焖鸡 · 无锡市 · 快餐简餐
              </p>
            </div>

            <div className="rounded-full bg-white px-4 py-2 text-sm text-[#777] shadow-sm ring-1 ring-black/[0.05]">
              2026年9月3日
            </div>
          </div>
        </section>

        {/* AI 总结 */}
        <section className="mb-6 overflow-hidden rounded-[28px] bg-[#171717] text-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
          <div className="relative p-7 md:p-10">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#ff6b35]/20 blur-3xl" />

            <div className="relative">
              <div className="mb-5 flex items-center gap-2 text-[#ff9068]">
                <Sparkles size={21} />
                <span className="font-semibold">AI 核心判断</span>
              </div>

              <h2 className="max-w-[850px] text-[26px] font-bold leading-tight md:text-[34px]">
                营业额上涨 12.8%，但利润下降 3.6%
              </h2>

              <p className="mt-5 max-w-[850px] text-[16px] leading-8 text-white/65 md:text-[17px]">
                今天订单增长明显，但增长主要来自高折扣套餐。与此同时，高毛利菜品销量下降，
                导致营业额虽然上涨，实际利润反而被压缩。
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white/[0.07] p-4">
                  <div className="text-sm text-white/50">经营评分</div>
                  <div className="mt-1 text-3xl font-bold">76</div>
                  <div className="mt-1 text-sm text-[#ff9068]">/ 100</div>
                </div>

                <div className="rounded-2xl bg-white/[0.07] p-4">
                  <div className="text-sm text-white/50">预计利润损失</div>
                  <div className="mt-1 text-3xl font-bold">¥180</div>
                  <div className="mt-1 text-sm text-white/45">今日估算</div>
                </div>

                <div className="rounded-2xl bg-white/[0.07] p-4">
                  <div className="text-sm text-white/50">优化空间</div>
                  <div className="mt-1 text-3xl font-bold">¥263</div>
                  <div className="mt-1 text-sm text-white/45">预计每日</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 四项数据 */}
        <section className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {metrics.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-[22px] bg-white p-5 shadow-sm ring-1 ring-black/[0.05]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#777]">{item.title}</span>
                  <Icon size={20} className="text-[#777]" />
                </div>

                <div className="mt-5 text-[27px] font-bold tracking-[-1px] md:text-[30px]">
                  {item.value}
                </div>

                <div
                  className={`mt-2 flex items-center gap-1 text-sm ${
                    item.positive ? "text-[#12a150]" : "text-[#ef4444]"
                  }`}
                >
                  {item.positive ? (
                    <ArrowUpRight size={16} />
                  ) : (
                    <ArrowDownRight size={16} />
                  )}

                  {item.change} 较昨日
                </div>
              </div>
            );
          })}
        </section>

        {/* 核心问题 */}
        <section className="mb-8">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-[24px] font-bold">AI 发现的经营问题</h2>
              <p className="mt-1 text-sm text-[#888]">
                优先处理影响利润最大的问题
              </p>
            </div>

            <div className="hidden items-center gap-1 text-sm text-[#999] sm:flex">
              <AlertTriangle size={16} />
              3 个问题
            </div>
          </div>

          <div className="space-y-3">
            {problems.map((problem) => (
              <div
                key={problem.title}
                className="rounded-[22px] bg-white p-5 shadow-sm ring-1 ring-black/[0.05] md:p-6"
              >
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff1eb] text-[#ff6b35]">
                    <AlertTriangle size={21} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold">{problem.title}</h3>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          problem.level === "高"
                            ? "bg-red-50 text-red-500"
                            : "bg-orange-50 text-orange-500"
                        }`}
                      >
                        {problem.level}优先级
                      </span>
                    </div>

                    <p className="mt-2 text-[14px] leading-6 text-[#777]">
                      {problem.description}
                    </p>

                    <div className="mt-3 font-medium text-[#ef4444]">
                      {problem.impact}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI 建议 */}
        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-[24px] font-bold">今天应该怎么做</h2>
            <p className="mt-1 text-sm text-[#888]">
              餐谋 AI 根据当前经营数据给出的行动建议
            </p>
          </div>

          <div className="space-y-3">
            {suggestions.map((item) => (
              <div
                key={item.number}
                className="rounded-[22px] border border-[#ff6b35]/10 bg-white p-5 shadow-sm md:p-6"
              >
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#171717] text-sm font-bold text-white">
                    {item.number}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-[17px] font-bold">{item.title}</h3>

                    <p className="mt-2 text-[14px] leading-6 text-[#777]">
                      {item.description}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[#12a150]">
                        <TrendingUp size={17} />
                        {item.expected}
                      </div>

                      <button className="flex items-center gap-1 text-sm font-medium text-[#ff6b35]">
                        查看执行方案
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 利润机会 */}
        <section className="mb-8 overflow-hidden rounded-[26px] bg-[#fff1eb] p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#ff6b35]">
                <Target size={21} />
                <span className="font-semibold">今天最大的赚钱机会</span>
              </div>

              <h2 className="mt-3 text-[25px] font-bold">
                优化套餐结构 + 主推高毛利菜品
              </h2>

              <p className="mt-2 max-w-[650px] text-[14px] leading-6 text-[#777]">
                不需要增加广告预算，优先调整现有流量分配和菜单结构。
              </p>
            </div>

            <div className="shrink-0 rounded-2xl bg-white px-6 py-5 text-center shadow-sm">
              <div className="text-sm text-[#888]">预计每天多赚</div>
              <div className="mt-1 text-[32px] font-bold text-[#ff6b35]">
                ¥186～¥263
              </div>
            </div>
          </div>
        </section>

        {/* 菜品分析 */}
        <section className="mb-8">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-[24px] font-bold">菜品利润分析</h2>
              <p className="mt-1 text-sm text-[#888]">
                找出真正帮你赚钱的菜
              </p>
            </div>

            <Link
              href="/dishes"
              className="hidden items-center gap-1 text-sm font-medium text-[#ff6b35] sm:flex"
            >
              查看全部
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="overflow-hidden rounded-[22px] bg-white shadow-sm ring-1 ring-black/[0.05]">
            <div className="hidden grid-cols-[1.7fr_0.8fr_0.8fr_0.9fr_0.8fr_0.8fr] border-b border-black/[0.06] px-5 py-4 text-sm text-[#999] md:grid">
              <div>菜品</div>
              <div>售价</div>
              <div>成本</div>
              <div>毛利率</div>
              <div>销量</div>
              <div>建议</div>
            </div>

            {dishes.map((dish) => (
              <div
                key={dish.name}
                className="grid grid-cols-2 gap-4 border-b border-black/[0.05] p-5 last:border-0 md:grid-cols-[1.7fr_0.8fr_0.8fr_0.9fr_0.8fr_0.8fr] md:items-center"
              >
                <div className="col-span-2 flex items-center gap-3 md:col-span-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f5f3]">
                    <Utensils size={18} className="text-[#666]" />
                  </div>

                  <div>
                    <div className="font-semibold">{dish.name}</div>
                    <div className="mt-0.5 text-xs text-[#aaa] md:hidden">
                      销量 {dish.sales}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-[#aaa] md:hidden">售价</div>
                  <div className="font-medium">{dish.price}</div>
                </div>

                <div>
                  <div className="text-xs text-[#aaa] md:hidden">成本</div>
                  <div className="font-medium">{dish.cost}</div>
                </div>

                <div>
                  <div className="text-xs text-[#aaa] md:hidden">毛利率</div>
                  <div
                    className={`font-bold ${
                      dish.good ? "text-[#12a150]" : "text-[#ef4444]"
                    }`}
                  >
                    {dish.margin}
                  </div>
                </div>

                <div className="hidden md:block">{dish.sales}</div>

                <div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      dish.status === "主推"
                        ? "bg-green-50 text-green-600"
                        : dish.status === "调价"
                          ? "bg-red-50 text-red-500"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {dish.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI 建议卡片 */}
        <section className="rounded-[24px] border border-black/[0.06] bg-white p-6 md:p-8">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff1eb] text-[#ff6b35]">
              <Lightbulb size={21} />
            </div>

            <div>
              <h3 className="font-bold">餐谋 AI 提醒</h3>

              <p className="mt-2 text-[14px] leading-6 text-[#777]">
                不要只看营业额。今天营业额增加了 ¥946，但预计利润反而下降。
                对餐饮店来说，真正重要的是<strong className="text-[#222]">
                  最后留下多少钱
                </strong>
                。
              </p>
            </div>
          </div>
        </section>

        {/* 底部 CTA */}
        <section className="mt-8 rounded-[26px] bg-[#171717] p-7 text-white md:p-9">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#ff9068]">
                <BarChart3 size={20} />
                <span className="font-semibold">继续优化你的餐厅</span>
              </div>

              <h2 className="mt-2 text-[23px] font-bold">
                明天继续帮你算，哪里还能多赚？
              </h2>

              <p className="mt-2 text-sm text-white/50">
                持续记录经营数据，餐谋 AI 会越来越了解你的餐厅。
              </p>
            </div>

            <Link
              href="/restaurant"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#ff6b35] px-6 py-3.5 font-semibold text-white transition hover:bg-[#ff5a20]"
            >
              返回经营总览
              <ChevronRight size={18} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
