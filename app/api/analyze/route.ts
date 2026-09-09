import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export const runtime = 'nodejs'

const FREE_LIMIT = 5

export async function POST(req: Request) {
  try {
    const supabase = await supabaseServer()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: '请先登录' }, { status: 401 })

    const body = await req.json().catch(() => ({}))
    const content = String(body.content || '').trim()
    if (content.length < 3) return NextResponse.json({ error: '请先粘贴顾客评价' }, { status: 400 })
    if (content.length > 5000) return NextResponse.json({ error: '评价最多5000字' }, { status: 400 })

    const { data: usage, error: usageError } = await supabase
      .from('usage').select('used_count,plan,period_start').eq('user_id', user.id).maybeSingle()
    if (usageError) return NextResponse.json({ error: usageError.message }, { status: 500 })

    const today = new Date().toISOString().slice(0, 10)
    let used = usage?.used_count ?? 0
    const plan = usage?.plan || 'free'
    if (!usage) {
      await supabase.from('usage').insert({ user_id: user.id, used_count: 0, plan: 'free', period_start: today })
      used = 0
    } else if ((usage.period_start || '') < today) {
      await supabase.from('usage').update({ used_count: 0, period_start: today }).eq('user_id', user.id)
      used = 0
    }

    if (plan === 'free' && used >= FREE_LIMIT) {
      return NextResponse.json({ error: '今日免费额度已用完，请升级会员继续使用', code: 'PAYWALL' }, { status: 402 })
    }

    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) return NextResponse.json({ error: '服务端尚未配置 DEEPSEEK_API_KEY' }, { status: 500 })

    const prompt = `你是“餐谋AI”的资深餐饮经营顾问。请分析下面这条顾客评价，并严格只返回JSON，不要Markdown。\n评价：${content}\nJSON字段必须为：sentiment（正面/中性/负面）、problemType（问题类型）、urgency（低/中/高）、problemSummary（问题总结）、publicReply（适合公开平台的真诚回复，80-150字）、recoveryAction（顾客挽回方案）、managerAdvice（老板应该立刻做什么）。回复要具体、克制、像真实餐饮老板，不要出现“作为AI”等字样。`

    const ai = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: process.env.DEEPSEEK_MODEL || 'deepseek-chat', temperature: 0.4, messages: [{ role: 'system', content: '你只输出合法JSON。' }, { role: 'user', content: prompt }] }),
    })
    if (!ai.ok) {
      const text = await ai.text()
      return NextResponse.json({ error: `DeepSeek调用失败：${text.slice(0, 300)}` }, { status: 502 })
    }

    const data = await ai.json()
    const raw = data?.choices?.[0]?.message?.content || ''
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim()
    let result: any
    try { result = JSON.parse(cleaned) } catch { return NextResponse.json({ error: 'AI返回格式异常，请重试' }, { status: 502 }) }

    if (plan === 'free') {
      const { error } = await supabase.from('usage').update({ used_count: used + 1, period_start: today }).eq('user_id', user.id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ result, remaining: plan === 'free' ? Math.max(0, FREE_LIMIT - used - 1) : null })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || '服务器错误' }, { status: 500 })
  }
}
