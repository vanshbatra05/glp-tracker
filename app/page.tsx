'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface DailyLog {
  id: string
  created_at: string
  weight: number
  water: number
  steps: number
  protein: number
  calories: number
}

export default function Home() {
  const [weight, setWeight] = useState('')
  const [water, setWater] = useState('')
  const [steps, setSteps] = useState('')
  const [protein, setProtein] = useState('')
  const [calories, setCalories] = useState('')

  const [logs, setLogs] = useState<DailyLog[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchLogs()
  }, [])

  async function fetchLogs() {
    const { data, error } = await supabase
      .from('daily_logs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      return
    }

    setLogs(data || [])
  }

  async function saveLog() {
    if (!weight) {
      alert('Please enter weight')
      return
    }

    setLoading(true)

    const { error } = await supabase
      .from('daily_logs')
      .insert({
        weight: Number(weight),
        water: Number(water || 0),
        steps: Number(steps || 0),
        protein: Number(protein || 0),
        calories: Number(calories || 0),
      })

    setLoading(false)

    if (error) {
      alert(error.message)
      console.error(error)
      return
    }

    alert('Saved Successfully ✅')

    setWeight('')
    setWater('')
    setSteps('')
    setProtein('')
    setCalories('')

    fetchLogs()
  }

  async function deleteLog(id: string) {
    const { error } = await supabase
      .from('daily_logs')
      .delete()
      .eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    fetchLogs()
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-6xl font-bold">
        GLP Tracker
      </h1>

      <p className="text-gray-400 text-xl mt-2">
        AI Powered GLP-1 Tracker
      </p>

      <div className="mt-8 bg-gray-900 p-6 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6">
          Daily Log
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="p-3 rounded-lg bg-white text-black"
          />

          <input
            type="number"
            placeholder="Water (L)"
            value={water}
            onChange={(e) => setWater(e.target.value)}
            className="p-3 rounded-lg bg-white text-black"
          />

          <input
            type="number"
            placeholder="Steps"
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            className="p-3 rounded-lg bg-white text-black"
          />

          <input
            type="number"
            placeholder="Protein (g)"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            className="p-3 rounded-lg bg-white text-black"
          />

          <input
            type="number"
            placeholder="Calories"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className="p-3 rounded-lg bg-white text-black md:col-span-2"
          />

        </div>

        <button
          onClick={saveLog}
          disabled={loading}
          className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
        >
          {loading ? 'Saving...' : 'Save Daily Log'}
        </button>
      </div>

      <div className="mt-10 bg-gray-900 rounded-2xl p-6">

  <h2 className="text-2xl font-bold mb-6">

    History

  </h2>

  {logs.length === 0 ? (

    <p className="text-gray-400">

      No Logs Yet

    </p>

  ) : (

    <div className="space-y-4">

      {logs.map((log) => (

        <div

          key={log.id}

          className="bg-gray-800 rounded-xl p-4"

        >

          <div className="flex justify-between items-center mb-4">

            <h3 className="font-semibold">

              📅 {new Date(log.created_at).toLocaleDateString()}

            </h3>

            <button

              onClick={() => deleteLog(log.id)}

              className="bg-red-600 px-3 py-1 rounded text-sm"

            >

              Delete

            </button>

          </div>

          <div className="grid grid-cols-2 gap-3">

            <div>

              <p className="text-gray-400 text-sm">

                Weight

              </p>

              <p className="font-bold">

                ⚖️ {log.weight} kg

              </p>

            </div>

            <div>

              <p className="text-gray-400 text-sm">

                Water

              </p>

              <p className="font-bold">

                💧 {log.water} L

              </p>

            </div>

            <div>

              <p className="text-gray-400 text-sm">

                Steps

              </p>

              <p className="font-bold">

                🚶 {log.steps}

              </p>

            </div>

            <div>

              <p className="text-gray-400 text-sm">

                Protein

              </p>

              <p className="font-bold">

                🥩 {log.protein} g

              </p>

            </div>

            <div className="col-span-2">

              <p className="text-gray-400 text-sm">

                Calories

              </p>

              <p className="font-bold">

                🔥 {log.calories} kcal

              </p>

            </div>

          </div>

        </div>

      ))}

    </div>

  )}

</div>
    </main>
  )
}