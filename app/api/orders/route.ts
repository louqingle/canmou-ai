import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

const PLANS = {
  basic: { amount: 49, name: '基础版' },
  pro: { amount: 99, name: '专业版 PRO' },
  store: { amount: 199, name: '门店版' },
} as const

export async function POST(req: Request) {
  try {
    const supabase = await supabaseServer()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: '请先登录' }, { status: 401 })

    const b = await req.json().catch(() => ({}))
    const plan = b.plan as keyof typeof PLANS
    const method = b.method
    if (!PLANS[plan] || !['wechat', 'alipay'].includes(method)) {
      return NextResponse.json({ error: '订单参数错误' }, { status: 400 })
    }

    const { data, error } = await supabase.from('payment_orders').insert({
      user_id: user.id,
      plan,
      amount: PLANS[plan].amount,
      method,
      status: 'pending',
      payer_name: String(b.payerName || '').trim() || null,
      transaction_no: String(b.transactionNo || '').trim() || null,
      note: String(b.note || '').trim() || null,
    }).select().single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ order: data })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || '服务器错误' }, { status: 500 })
  }
}
