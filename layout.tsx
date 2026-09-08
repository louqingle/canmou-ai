import './globals.css'
import Link from 'next/link'
export const metadata={title:'餐谋AI｜AI餐饮经营助手',description:'发现差评问题、生成回复、经营诊断与营销文案'}
export default function RootLayout({children}:{children:React.ReactNode}){return <div className="shell"><nav className="nav"><Link href="/" className="brand">餐谋<span>AI</span></Link><div className="navlinks"><Link href="/dashboard">工作台</Link><Link href="/reviews">评价分析</Link><Link href="/marketing">AI营销</Link><Link href="/login">登录</Link></div></nav>{children}</div>}
