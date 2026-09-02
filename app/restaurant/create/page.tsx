"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  ChefHat,
  Check,
  CircleDollarSign,
  MapPin,
  Store,
  Utensils,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type FormData = {
  name: string;
  category: string;
  city: string;
  address: string;
  daily_orders: string;
  average_price: string;
};

type Restaurant = {
  id: string;
  name: string;
  category: string;
  city: string;
  address: string | null;
  daily_orders: number | null;
  average_price: number | string | null;
};

const categories = [
  "中式正餐",
  "快餐简餐",
  "烧烤",
  "火锅",
  "奶茶饮品",
  "面馆",
  "小吃",
  "烘焙甜品",
  "咖啡",
  "西餐",
  "日料",
  "其他",
];

export default function CreateRestaurantPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [existingRestaurant, setExistingRestaurant] =
    useState<Restaurant | null>(null);

  const [form, setForm] =
    useState<FormData>({
      name: "",
      category: "",
      city: "",
      address: "",
      daily_orders: "",
      average_price: "",
    });

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  /*
   * =========================
   * 初始化
   * =========================
   */

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        setLoading(true);
        setError("");

        /*
         * ① 获取登录用户
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
         * ② 从数据库查餐厅
         */
        const {
          data: restaurant,
          error: restaurantError,
        } = await supabase
          .from("restaurants")
          .select(
            "id,name,category,city,address,daily_orders,average_price"
          )
          .eq("user_id", user.id)
          .order("created_at", {
            ascending: false,
          })
          .limit(1)
          .maybeSingle();

        if (!mounted) return;

        if (restaurantError) {
          console.error(
            "读取餐厅失败:",
            restaurantError
          );

          setError(
            `读取餐厅资料失败：${restaurantError.message}`
          );

          setLoading(false);
          return;
        }

        /*
         * ③ 已经有餐厅
         *
         * 不跳首页。
         *
         * 直接加载资料，
         * 当前页面变成“编辑门店”。
         */
        if (restaurant) {
          setExistingRestaurant(
            restaurant
          );

          setForm({
            name:
              restaurant.name || "",

            category:
              restaurant.category || "",

            city:
              restaurant.city || "",

            address:
              restaurant.address || "",

            daily_orders:
              restaurant.daily_orders !==
              null
                ? String(
                    restaurant.daily_orders
                  )
                : "",

            average_price:
              restaurant.average_price !==
              null
                ? String(
                    restaurant.average_price
                  )
                : "",
          });
        }

        setLoading(false);
      } catch (err) {
        console.error(
          "初始化餐厅页面失败:",
          err
        );

        if (mounted) {
          setError(
            "页面初始化失败，请刷新后重试。"
          );

          setLoading(false);
        }
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, [router]);

  /*
   * =========================
   * 更新表单
   * =========================
   */

  function updateField(
    field: keyof FormData,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess(false);
    }
  }

  /*
   * =========================
   * 提交
   * =========================
   */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (saving) return;

    setError("");
    setSuccess(false);

    const name =
      form.name.trim();

    const category =
      form.category.trim();

    const city =
      form.city.trim();

    const address =
      form.address.trim();

    const dailyOrders =
      Number(form.daily_orders);

    const averagePrice =
      Number(form.average_price);

    /*
     * 基础校验
     */

    if (!name) {
      setError(
        "请输入餐厅名称。"
      );
      return;
    }

    if (name.length < 2) {
      setError(
        "餐厅名称至少需要 2 个字符。"
      );
      return;
    }

    if (!category) {
      setError(
        "请选择餐饮类型。"
      );
      return;
    }

    if (!city) {
      setError(
        "请输入所在城市。"
      );
      return;
    }

    if (!address) {
      setError(
        "请输入门店地址。"
      );
      return;
    }

    if (!form.daily_orders.trim()) {
      setError(
        "请输入日均订单量。"
      );
      return;
    }

    if (
      !Number.isFinite(
        dailyOrders
      ) ||
      dailyOrders < 0 ||
      dailyOrders > 100000
    ) {
      setError(
        "日均订单量请输入 0～100000 之间的数字。"
      );
      return;
    }

    if (!form.average_price.trim()) {
      setError(
        "请输入平均客单价。"
      );
      return;
    }

    if (
      !Number.isFinite(
        averagePrice
      ) ||
      averagePrice <= 0 ||
      averagePrice > 10000
    ) {
      setError(
        "平均客单价请输入 0～10000 之间的数字。"
      );
      return;
    }

    try {
      setSaving(true);

      /*
       * ① 再次获取用户
       */
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError(
          "登录状态已失效，请重新登录。"
        );

        router.replace("/login");
        return;
      }

      /*
       * =========================
       * 已存在 → UPDATE
       * =========================
       */

      if (existingRestaurant) {
        const {
          data,
          error: updateError,
        } = await supabase
          .from("restaurants")
          .update({
            name,
            category,
            city,
            address,
            daily_orders:
              Math.round(
                dailyOrders
              ),
            average_price:
              averagePrice,
          })
          .eq(
            "id",
            existingRestaurant.id
          )
          .eq(
            "user_id",
            user.id
          )
          .select(
            "id,name,category,city,address,daily_orders,average_price"
          )
          .single();

        if (updateError) {
          console.error(
            "更新餐厅失败:",
            updateError
          );

          if (
            updateError.message
              .toLowerCase()
              .includes(
                "row-level security"
              )
          ) {
            setError(
              "保存失败：Supabase 数据库权限（RLS）没有允许当前用户修改餐厅。"
            );
          } else {
            setError(
              `保存失败：${updateError.message}`
            );
          }

          return;
        }

        if (!data) {
          setError(
            "保存失败，请稍后重试。"
          );
          return;
        }

        /*
         * 更新本地状态
         */
        setExistingRestaurant(
          data
        );

        setForm({
          name:
            data.name || "",

          category:
            data.category || "",

          city:
            data.city || "",

          address:
            data.address || "",

          daily_orders:
            data.daily_orders !==
            null
              ? String(
                  data.daily_orders
                )
              : "",

          average_price:
            data.average_price !==
            null
              ? String(
                  data.average_price
                )
              : "",
        });

        setSuccess(true);

        /*
         * 保存成功后回首页
         */
        setTimeout(() => {
          router.replace("/");
          router.refresh();
        }, 700);

        return;
      }

      /*
       * =========================
       * 不存在 → INSERT
       * =========================
       */

      const {
        data: restaurant,
        error: insertError,
      } = await supabase
        .from("restaurants")
        .insert({
          user_id: user.id,
          name,
          category,
          city,
          address,
          daily_orders:
            Math.round(
              dailyOrders
            ),
          average_price:
            averagePrice,
        })
        .select(
          "id,name,category,city,address,daily_orders,average_price"
        )
        .single();

      if (insertError) {
        console.error(
          "创建餐厅失败:",
          insertError
        );

        if (
          insertError.message
            .toLowerCase()
            .includes(
              "row-level security"
            )
        ) {
          setError(
            "创建失败：Supabase 数据库权限（RLS）没有允许当前用户创建餐厅。"
          );
        } else {
          setError(
            `创建餐厅失败：${insertError.message}`
          );
        }

        return;
      }

      if (!restaurant) {
        setError(
          "餐厅创建失败，请稍后重试。"
        );

        return;
      }

      /*
       * 保存成功
       */
      setExistingRestaurant(
        restaurant
      );

      setSuccess(true);

      /*
       * 返回首页
       */
      setTimeout(() => {
        router.replace("/");
        router.refresh();
      }, 700);
    } catch (err) {
      console.error(
        "保存餐厅发生未知错误:",
        err
      );

      setError(
        "保存餐厅失败，请检查网络后重试。"
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * =========================
   * Loading
   * =========================
   */

  if (loading) {
    return (
      <main style={styles.loadingPage}>
        <div
          style={styles.loadingBox}
        >
          <div
            style={styles.loadingIcon}
          >
            <ChefHat size={25} />
          </div>

          <div
            style={styles.spinner}
          />

          <div
            style={styles.loadingTitle}
          >
            正在读取餐厅资料...
          </div>

          <div
            style={styles.loadingText}
          >
            请稍候
          </div>
        </div>

        <style jsx>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </main>
    );
  }

  const isEditing =
    Boolean(existingRestaurant);

  return (
    <main style={styles.page}>
      <div
        style={
          styles.backgroundGlowOne
        }
      />

      <div
        style={
          styles.backgroundGlowTwo
        }
      />

      <div
        style={styles.container}
      >
        {/* Header */}

        <header style={styles.header}>
          <button
            type="button"
            onClick={() =>
              router.replace("/")
            }
            style={
              styles.backButton
            }
          >
            <ArrowLeft size={17} />
            返回
          </button>

          <div style={styles.brand}>
            <div
              style={styles.brandIcon}
            >
              <ChefHat size={19} />
            </div>

            <div>
              <div
                style={styles.brandName}
              >
                餐谋 AI
              </div>

              <div
                style={styles.brandSub}
              >
                懂餐饮，更懂赚钱
              </div>
            </div>
          </div>

          <div style={styles.step}>
            <span
              style={
                styles.stepActive
              }
            >
              01
            </span>

            <span
              style={styles.stepLine}
            />

            <span>02</span>
          </div>
        </header>

        {/* Hero */}

        <section style={styles.hero}>
          <div
            style={styles.eyebrow}
          >
            <Store size={15} />

            {isEditing
              ? "门店设置"
              : "第一步 · 创建门店"}
          </div>

          <h1 style={styles.title}>
            {isEditing ? (
              <>
                修改你的
                <br />
                餐厅资料
              </>
            ) : (
              <>
                先让餐谋 AI
                <br />
                了解你的餐厅
              </>
            )}
          </h1>

          <p
            style={
              styles.description
            }
          >
            {isEditing
              ? "修改后的信息会立即保存，用于后续经营分析。"
              : "填写一些基础经营信息，餐谋 AI 才能给你更准确的经营分析和赚钱建议。"}
          </p>
        </section>

        {/* Card */}

        <form
          onSubmit={handleSubmit}
          style={styles.card}
        >
          {/* 基本信息 */}

          <div style={styles.section}>
            <div
              style={
                styles.sectionHeader
              }
            >
              <div
                style={
                  styles.sectionIcon
                }
              >
                <Building2 size={18} />
              </div>

              <div>
                <h2
                  style={
                    styles.sectionTitle
                  }
                >
                  基本信息
                </h2>

                <p
                  style={
                    styles.sectionDescription
                  }
                >
                  先告诉我们你的门店是什么
                </p>
              </div>
            </div>

            {/* 名称 */}

            <div style={styles.field}>
              <label
                style={styles.label}
              >
                餐厅名称
                <span
                  style={
                    styles.required
                  }
                >
                  *
                </span>
              </label>

              <input
                value={form.name}
                onChange={(e) =>
                  updateField(
                    "name",
                    e.target.value
                  )
                }
                placeholder="例如：小乐家的黄焖鸡"
                maxLength={50}
                disabled={saving}
                style={styles.input}
                autoComplete="organization"
              />
            </div>

            {/* 类型 */}

            <div style={styles.field}>
              <label
                style={styles.label}
              >
                餐饮类型
                <span
                  style={
                    styles.required
                  }
                >
                  *
                </span>
              </label>

              <div
                style={
                  styles.categoryGrid
                }
              >
                {categories.map(
                  (item) => {
                    const selected =
                      form.category ===
                      item;

                    return (
                      <button
                        key={item}
                        type="button"
                        disabled={
                          saving
                        }
                        onClick={() =>
                          updateField(
                            "category",
                            item
                          )
                        }
                        style={{
                          ...styles.categoryButton,
                          ...(selected
                            ? styles.categoryButtonActive
                            : {}),
                        }}
                      >
                        {selected && (
                          <Check
                            size={13}
                            strokeWidth={
                              3
                            }
                          />
                        )}

                        {item}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </div>

          <div
            style={styles.divider}
          />

          {/* 地址 */}

          <div style={styles.section}>
            <div
              style={
                styles.sectionHeader
              }
            >
              <div
                style={
                  styles.sectionIcon
                }
              >
                <MapPin size={18} />
              </div>

              <div>
                <h2
                  style={
                    styles.sectionTitle
                  }
                >
                  门店位置
                </h2>

                <p
                  style={
                    styles.sectionDescription
                  }
                >
                  用于后续进行区域经营分析
                </p>
              </div>
            </div>

            <div
              style={
                styles.twoColumns
              }
            >
              <div style={styles.field}>
                <label
                  style={styles.label}
                >
                  所在城市
                  <span
                    style={
                      styles.required
                    }
                  >
                    *
                  </span>
                </label>

                <input
                  value={form.city}
                  onChange={(e) =>
                    updateField(
                      "city",
                      e.target.value
                    )
                  }
                  placeholder="例如：无锡"
                  maxLength={30}
                  disabled={saving}
                  style={styles.input}
                  autoComplete="address-level2"
                />
              </div>

              <div style={styles.field}>
                <label
                  style={styles.label}
                >
                  门店地址
                  <span
                    style={
                      styles.required
                    }
                  >
                    *
                  </span>
                </label>

                <input
                  value={form.address}
                  onChange={(e) =>
                    updateField(
                      "address",
                      e.target.value
                    )
                  }
                  placeholder="例如：梁溪区中山路88号"
                  maxLength={100}
                  disabled={saving}
                  style={styles.input}
                  autoComplete="street-address"
                />
              </div>
            </div>
          </div>

          <div
            style={styles.divider}
          />

          {/* 经营概况 */}

          <div style={styles.section}>
            <div
              style={
                styles.sectionHeader
              }
            >
              <div
                style={
                  styles.sectionIcon
                }
              >
                <CircleDollarSign size={18} />
              </div>

              <div>
                <h2
                  style={
                    styles.sectionTitle
                  }
                >
                  经营概况
                </h2>

                <p
                  style={
                    styles.sectionDescription
                  }
                >
                  粗略数据即可，后续可以随时修改
                </p>
              </div>
            </div>

            <div
              style={
                styles.twoColumns
              }
            >
              {/* 日均订单 */}

              <div style={styles.field}>
                <label
                  style={styles.label}
                >
                  日均订单
                  <span
                    style={
                      styles.required
                    }
                  >
                    *
                  </span>
                </label>

                <div
                  style={
                    styles.inputWithSuffix
                  }
                >
                  <input
                    value={
                      form.daily_orders
                    }
                    onChange={(e) =>
                      updateField(
                        "daily_orders",
                        e.target.value
                      )
                    }
                    type="number"
                    min="0"
                    max="100000"
                    step="1"
                    inputMode="numeric"
                    placeholder="例如：120"
                    disabled={saving}
                    style={
                      styles.inputInside
                    }
                  />

                  <span
                    style={
                      styles.suffix
                    }
                  >
                    单
                  </span>
                </div>

                <div
                  style={styles.helper}
                >
                  平均每天大约有多少订单？
                </div>
              </div>

              {/* 客单价 */}

              <div style={styles.field}>
                <label
                  style={styles.label}
                >
                  平均客单价
                  <span
                    style={
                      styles.required
                    }
                  >
                    *
                  </span>
                </label>

                <div
                  style={
                    styles.inputWithSuffix
                  }
                >
                  <span
                    style={
                      styles.prefix
                    }
                  >
                    ¥
                  </span>

                  <input
                    value={
                      form.average_price
                    }
                    onChange={(e) =>
                      updateField(
                        "average_price",
                        e.target.value
                      )
                    }
                    type="number"
                    min="0"
                    max="10000"
                    step="0.01"
                    inputMode="decimal"
                    placeholder="例如：35"
                    disabled={saving}
                    style={
                      styles.inputInsideWithPrefix
                    }
                  />

                  <span
                    style={
                      styles.suffix
                    }
                  >
                    /单
                  </span>
                </div>

                <div
                  style={styles.helper}
                >
                  顾客平均每单消费多少钱？
                </div>
              </div>
            </div>
          </div>

          {/* Error */}

          {error && (
            <div
              style={
                styles.errorBox
              }
            >
              <div
                style={
                  styles.errorIcon
                }
              >
                !
              </div>

              <div>
                <div
                  style={
                    styles.errorTitle
                  }
                >
                  操作失败
                </div>

                <div
                  style={
                    styles.errorText
                  }
                >
                  {error}
                </div>
              </div>
            </div>
          )}

          {/* Success */}

          {success && (
            <div
              style={
                styles.successBox
              }
            >
              <div
                style={
                  styles.successIcon
                }
              >
                <Check size={17} />
              </div>

              <div>
                <div
                  style={
                    styles.successTitle
                  }
                >
                  {isEditing
                    ? "餐厅资料保存成功"
                    : "餐厅创建成功"}
                </div>

                <div
                  style={
                    styles.successText
                  }
                >
                  正在进入餐谋 AI 经营总览...
                </div>
              </div>
            </div>
          )}

          {/* Footer */}

          <div style={styles.footer}>
            <div
              style={styles.footerTip}
            >
              <Utensils size={14} />

              信息可以之后在门店设置中修改
            </div>

            <button
              type="submit"
              disabled={
                saving || success
              }
              style={{
                ...styles.submitButton,
                ...(saving ||
                success
                  ? styles.submitButtonDisabled
                  : {}),
              }}
            >
              {saving ? (
                <>
                  <span
                    style={
                      styles.buttonSpinner
                    }
                  />

                  正在保存...
                </>
              ) : success ? (
                <>
                  <Check size={18} />

                  保存成功
                </>
              ) : (
                <>
                  {isEditing
                    ? "保存修改"
                    : "创建餐厅"}

                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>

        <div
          style={styles.bottomText}
        >
          餐谋 AI · 你的餐饮经营助手
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </main>
  );
}

/*
 * =========================
 * Styles
 * =========================
 */

const styles: Record<
  string,
  React.CSSProperties
> = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #fafaf8 0%, #f4f4f1 100%)",
    color: "#171717",
    position: "relative",
    overflow: "hidden",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
  },

  backgroundGlowOne: {
    position: "fixed",
    width: "420px",
    height: "420px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(34,197,94,0.08) 0%, rgba(34,197,94,0) 70%)",
    top: "-180px",
    right: "-100px",
    pointerEvents: "none",
  },

  backgroundGlowTwo: {
    position: "fixed",
    width: "360px",
    height: "360px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0) 70%)",
    bottom: "-160px",
    left: "-100px",
    pointerEvents: "none",
  },

  container: {
    width: "100%",
    maxWidth: "920px",
    margin: "0 auto",
    padding: "22px 20px 50px",
    position: "relative",
    zIndex: 1,
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: "48px",
  },

  backButton: {
    border: "1px solid #e2e2de",
    background: "rgba(255,255,255,0.8)",
    color: "#555",
    borderRadius: "10px",
    padding: "9px 13px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 700,
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  brandIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "11px",
    background: "#171717",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  brandName: {
    fontSize: "15px",
    fontWeight: 850,
    letterSpacing: "-0.3px",
  },

  brandSub: {
    marginTop: "1px",
    fontSize: "9px",
    color: "#999",
    letterSpacing: "0.2px",
  },

  step: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    fontSize: "10px",
    color: "#aaa",
    fontWeight: 800,
  },

  stepActive: {
    color: "#171717",
  },

  stepLine: {
    width: "26px",
    height: "1px",
    background: "#d5d5d0",
  },

  hero: {
    textAlign: "center",
    padding: "55px 0 35px",
  },

  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "7px 11px",
    background: "#fff",
    border: "1px solid #e7e7e3",
    borderRadius: "999px",
    color: "#666",
    fontSize: "11px",
    fontWeight: 750,
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.03)",
  },

  title: {
    margin: "18px 0 0",
    fontSize:
      "clamp(30px, 5vw, 46px)",
    lineHeight: 1.14,
    letterSpacing: "-1.8px",
    fontWeight: 900,
  },

  description: {
    maxWidth: "530px",
    margin: "17px auto 0",
    color: "#777",
    fontSize: "14px",
    lineHeight: 1.8,
  },

  card: {
    background: "#fff",
    border: "1px solid #e5e5e1",
    borderRadius: "20px",
    boxShadow:
      "0 15px 50px rgba(0,0,0,0.06)",
    overflow: "hidden",
  },

  section: {
    padding: "28px 30px",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "25px",
  },

  sectionIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    background: "#f4f4f1",
    color: "#171717",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  sectionTitle: {
    margin: 0,
    fontSize: "15px",
    fontWeight: 850,
    letterSpacing: "-0.2px",
  },

  sectionDescription: {
    margin: "3px 0 0",
    fontSize: "11px",
    color: "#999",
  },

  field: {
    marginTop: "20px",
  },

  label: {
    display: "block",
    fontSize: "12px",
    fontWeight: 800,
    color: "#333",
    marginBottom: "9px",
  },

  required: {
    color: "#ef4444",
    marginLeft: "3px",
  },

  input: {
    width: "100%",
    height: "48px",
    border: "1px solid #deded9",
    borderRadius: "10px",
    background: "#fcfcfb",
    padding: "0 14px",
    boxSizing: "border-box",
    outline: "none",
    color: "#171717",
    fontSize: "13px",
  },

  categoryGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(105px, 1fr))",
    gap: "9px",
  },

  categoryButton: {
    minHeight: "42px",
    border: "1px solid #e2e2de",
    background: "#fafaf8",
    borderRadius: "9px",
    color: "#666",
    padding: "8px 9px",
    fontSize: "11px",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
  },

  categoryButtonActive: {
    background: "#171717",
    color: "#fff",
    borderColor: "#171717",
  },

  divider: {
    height: "1px",
    background: "#eeeeea",
    margin: "0 30px",
  },

  twoColumns: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "18px",
  },

  inputWithSuffix: {
    height: "48px",
    display: "flex",
    alignItems: "center",
    border: "1px solid #deded9",
    borderRadius: "10px",
    background: "#fcfcfb",
    overflow: "hidden",
  },

  prefix: {
    paddingLeft: "14px",
    color: "#777",
    fontSize: "13px",
    fontWeight: 700,
  },

  inputInside: {
    flex: 1,
    width: "100%",
    height: "100%",
    border: 0,
    outline: "none",
    background: "transparent",
    padding: "0 12px 0 14px",
    boxSizing: "border-box",
    color: "#171717",
    fontSize: "13px",
  },

  inputInsideWithPrefix: {
    flex: 1,
    width: "100%",
    height: "100%",
    border: 0,
    outline: "none",
    background: "transparent",
    padding: "0 8px",
    boxSizing: "border-box",
    color: "#171717",
    fontSize: "13px",
  },

  suffix: {
    paddingRight: "13px",
    color: "#999",
    fontSize: "11px",
    whiteSpace: "nowrap",
  },

  helper: {
    marginTop: "7px",
    fontSize: "10px",
    color: "#aaa",
  },

  errorBox: {
    margin: "0 30px 20px",
    padding: "13px 14px",
    borderRadius: "11px",
    background: "#fff5f5",
    border: "1px solid #ffd6d6",
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
  },

  errorIcon: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    background: "#ef4444",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: 900,
    flexShrink: 0,
  },

  errorTitle: {
    fontSize: "11px",
    fontWeight: 850,
    color: "#b91c1c",
  },

  errorText: {
    marginTop: "3px",
    fontSize: "10px",
    lineHeight: 1.5,
    color: "#dc2626",
    wordBreak: "break-word",
  },

  successBox: {
    margin: "0 30px 20px",
    padding: "13px 14px",
    borderRadius: "11px",
    background: "#f1fdf5",
    border: "1px solid #ccefd9",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  successIcon: {
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    background: "#16a34a",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  successTitle: {
    fontSize: "11px",
    fontWeight: 850,
    color: "#15803d",
  },

  successText: {
    marginTop: "3px",
    fontSize: "10px",
    color: "#4d8a61",
  },

  footer: {
    padding: "22px 30px",
    background: "#fafaf8",
    borderTop: "1px solid #eeeeea",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
  },

  footerTip: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#999",
    fontSize: "10px",
  },

  submitButton: {
    height: "46px",
    border: 0,
    borderRadius: "10px",
    padding: "0 20px",
    background: "#171717",
    color: "#fff",
    fontSize: "12px",
    fontWeight: 850,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    minWidth: "145px",
  },

  submitButtonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },

  buttonSpinner: {
    width: "15px",
    height: "15px",
    borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.35)",
    borderTopColor: "#fff",
    display: "inline-block",
    animation:
      "spin 0.8s linear infinite",
  },

  bottomText: {
    textAlign: "center",
    marginTop: "24px",
    color: "#aaa",
    fontSize: "10px",
  },

  loadingPage: {
    minHeight: "100vh",
    background: "#f7f7f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
  },

  loadingBox: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  loadingIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "15px",
    background: "#171717",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "18px",
  },

  spinner: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    border: "2px solid #ddd",
    borderTopColor: "#171717",
    animation:
      "spin 0.8s linear infinite",
  },

  loadingTitle: {
    marginTop: "15px",
    color: "#444",
    fontSize: "13px",
    fontWeight: 700,
  },

  loadingText: {
    marginTop: "5px",
    color: "#aaa",
    fontSize: "10px",
  },
};
