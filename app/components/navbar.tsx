'use client'

import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function Navbar() {

  async function logout() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="flex justify-between items-center mb-8 bg-gray-900 p-4 rounded-2xl">

      <div>
        <h1 className="text-2xl font-bold">
          GLP Tracker
        </h1>
      </div>

      <div className="flex gap-3">

        <Link
          href="/"
          className="bg-gray-800 px-4 py-2 rounded-lg"
        >
          📊 Dashboard
        </Link>

        <Link
          href="/injections"
          className="bg-gray-800 px-4 py-2 rounded-lg"
        >
          💉 Injections
        </Link>

        <Link
          href="/reports"
          className="bg-gray-800 px-4 py-2 rounded-lg"
        >
          📈 Reports
        </Link>

        <Link
          href="/profile"
          className="bg-gray-800 px-4 py-2 rounded-lg"
        >
          👤 Profile
        </Link>

        <button
          onClick={logout}
          className="bg-red-600 px-4 py-2 rounded-lg"
        >
          Logout
        </button>

      </div>

    </div>
  )
}