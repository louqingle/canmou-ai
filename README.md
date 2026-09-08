# 餐谋AI V1

包含：Supabase 邮箱注册/登录、服务端免费额度5次/日、评价分析、AI营销、付款申请（微信/支付宝切换）、订单落库。

## 1. Supabase
已在目标项目执行数据库表与RLS：stores / usage / payment_orders / reviews。

## 2. 本地
npm install
cp .env.example .env.local
填写 DEEPSEEK_API_KEY（不填也可演示）
npm run dev

## 3. Vercel
配置同名环境变量后部署。

## 4. 支付
V1故意采用人工审核：用户选择套餐和微信/支付宝，提交付款人、交易单号和备注，订单写入 payment_orders。真正自动支付需要后续接微信支付/支付宝官方商户接口。
