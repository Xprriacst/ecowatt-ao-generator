import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { FileText, LogOut, User } from 'lucide-react'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let user = null
  let profile = null
  let subscription = null
  let aoUsed = 0

  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    user = authUser

    if (user) {
      const { data: p } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      profile = p

      const { data: s } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single()
      subscription = s

      const currentMonth = new Date().toISOString().slice(0, 7)
      const { data: usage } = await supabase
        .from('usage')
        .select('*')
        .eq('user_id', user.id)
        .eq('month', currentMonth)
        .single()
      aoUsed = usage?.ao_count || 0
    }
  } catch {
    // Supabase not configured or tables missing — continue in demo mode
  }

  const aoLimit = subscription?.plan === 'pro' ? 5 : 1
  const aoRemaining = Math.max(0, aoLimit - aoUsed)

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      {/* Header */}
      <header className="bg-white border-b border-[#c5c5d3]/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00236f] to-[#1e3a8a] rounded-lg flex items-center justify-center text-white">
                <FileText className="w-5 h-5" />
              </div>
              <span className="font-bold text-[#00236f] text-lg">MémoireAO</span>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {/* Usage Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#f7f9fb] rounded-lg text-sm">
              <span className="text-[#444651]">
                <span className="font-semibold text-[#00236f]">{aoRemaining}</span> AO restants
              </span>
              <div className="w-16 h-1.5 bg-[#c5c5d3]/30 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${aoUsed >= aoLimit ? 'bg-red-500' : 'bg-[#00236f]'}`}
                  style={{ width: `${Math.min(100, (aoUsed / aoLimit) * 100)}%` }}
                />
              </div>
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 text-sm text-[#444651]">
                  <User className="w-4 h-4" />
                  <span className="max-w-[150px] truncate">
                    {profile?.nom_entreprise || user.email}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    subscription?.plan === 'pro'
                      ? 'bg-[#00236f]/10 text-[#00236f]'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {subscription?.plan || 'free'}
                  </span>
                </div>
                <form action="/logout" method="post">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#444651] hover:text-[#00236f] hover:bg-[#f7f9fb] rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Déconnexion</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
                  Mode démo
                </span>
                <Link
                  href="/login"
                  className="text-sm font-medium text-[#444651] hover:text-[#00236f] transition-colors px-3 py-1.5"
                >
                  Se connecter
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  )
}
