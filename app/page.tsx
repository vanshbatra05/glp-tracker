'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
  const [goalWeight, setGoalWeight] = useState(80)

  const [logs, setLogs] = useState<DailyLog[]>([])
  const [loading, setLoading] = useState(false)

  const currentWeight =
    logs.length > 0 ? logs[0].weight : 0

  const startingWeight =
    logs.length > 0
      ? logs[logs.length - 1].weight
      : 0


  const remainingWeight =
    currentWeight > 0
      ? currentWeight - goalWeight
      : 0

  const progress =
    startingWeight > goalWeight
      ? ((startingWeight - currentWeight) /
          (startingWeight - goalWeight)) *
        100
      : 0

  const totalLogs = logs.length

  const [medication, setMedication] = useState('Mounjaro')
  const [customMedication, setCustomMedication] = useState('')
  const [dose, setDose] = useState('5 mg')
  const [injectionDate, setInjectionDate] = useState('')
  const [injectionSite, setInjectionSite] = useState('Abdomen Left')
  const [customSite, setCustomSite] = useState('')

  const [lastInjection, setLastInjection] = useState<any>(null)

  const chartData = [...logs]
    .reverse()
    .map((log) => ({
      date: new Date(
        log.created_at
      ).toLocaleDateString(),
      weight: log.weight,
    }))

  useEffect(() => {
  fetchLogs()
  fetchLastInjection()
}, [])

  async function fetchLogs() {
    const { data, error } = await supabase
      .from('daily_logs')
      .select('*')
      .order('created_at', {
        ascending: false,
      })

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

  async function fetchLastInjection() {
  const { data } = await supabase
    .from('injections')
    .select('*')
    .order('injection_date', {
      ascending: false,
    })
    .limit(1)

  if (data && data.length > 0) {
    setLastInjection(data[0])
  }
}

  async function saveInjection() {
  const { error } = await supabase
    .from('injections')
    .insert({
      medication,
      dose,
      injection_date: injectionDate,
      injection_site: injectionSite,
    })

  if (error) {
    alert(error.message)
    return
  }

  alert('Injection Saved 💉')
  fetchLastInjection()
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

  <div className="bg-gray-900 p-5 rounded-2xl">
    <p className="text-gray-400 text-sm">
      Current Weight
    </p>

    <h3 className="text-3xl font-bold text-green-400">
      {logs.length > 0 ? logs[0].weight : '--'} kg
    </h3>
  </div>

  <div className="bg-gray-900 p-5 rounded-2xl">
    <p className="text-gray-400 text-sm">
      Goal Weight
    </p>

    <h3 className="text-3xl font-bold text-blue-400">
      {goalWeight} kg
    </h3>
  </div>

  <div className="bg-gray-900 p-5 rounded-2xl">
    <p className="text-gray-400 text-sm">
      Remaining
    </p>

    <h3 className="text-3xl font-bold text-yellow-400">
      {logs.length > 0 ? (logs[0].weight - 80).toFixed(1) : '--'} kg
    </h3>
  </div>

  <div className="bg-gray-900 p-5 rounded-2xl">
    <p className="text-gray-400 text-sm">
      Total Logs
    </p>

    <h3 className="text-3xl font-bold text-purple-400">
      {logs.length}
    </h3>
  </div>

</div>

      <div className="mt-8 bg-gray-900 p-6 rounded-2xl">
  <h2 className="text-2xl font-bold mb-6">
    📈 Weight Trend
  </h2>

  <div style={{ width: '100%', height: 300 }}>
    <ResponsiveContainer>
      <LineChart data={chartData}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />

        <Line
          type="monotone"
          dataKey="weight"
          stroke="#22c55e"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>

      
      <div className="mt-6 bg-gray-900 p-6 rounded-2xl">
        <h2 className="text-xl font-bold mb-4">
          Goal Weight
        </h2>
        <input
          type="number"
          value={goalWeight}
          onChange={(e) =>
            setGoalWeight(Number(e.target.value))
          }
          className="p-3 rounded-lg bg-white text-black"
        />
</div>
      
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

      {lastInjection && (
  <div className="mt-8 bg-purple-900 p-6 rounded-2xl">
    <h2 className="text-xl font-bold mb-3">
      Last Injection
    </h2>

    <p>
      💉 {lastInjection.medication}
    </p>

    <p>
      Dose: {lastInjection.dose}
    </p>

    <p>
      Site: {lastInjection.injection_site}
    </p>

    <p>
      Date: {lastInjection.injection_date}
    </p>
  </div>
)}

      <div className="mt-8 bg-gray-900 p-6 rounded-2xl">
  <h2 className="text-2xl font-bold mb-6">
    💉 Injection Tracker
  </h2>

  <div className="grid md:grid-cols-2 gap-4">

    <select
      value={medication}
      onChange={(e) => setMedication(e.target.value)}
      className="p-3 rounded-lg bg-white text-black"
    >
      <option>Mounjaro</option>
      <option>Ozempic</option>
      <option>Wegovy</option>
      <option>Zepbound</option>
      <option>Rybelsus</option>
    </select>

    <select
      value={dose}
      onChange={(e) => setDose(e.target.value)}
      className="p-3 rounded-lg bg-white text-black"
    >
      <option>2.5 mg</option>
      <option>5 mg</option>
      <option>7.5 mg</option>
      <option>10 mg</option>
      <option>12.5 mg</option>
      <option>15 mg</option>
    </select>

    <input
      type="date"
      value={injectionDate}
      onChange={(e) => setInjectionDate(e.target.value)}
      className="p-3 rounded-lg bg-white text-black"
    />

    <select
      value={injectionSite}
      onChange={(e) => setInjectionSite(e.target.value)}
      className="p-3 rounded-lg bg-white text-black"
    >
      <option>Abdomen Left</option>
      <option>Abdomen Right</option>
      <option>Thigh Left</option>
      <option>Thigh Right</option>
      <option>Arm Left</option>
      <option>Arm Right</option>
    </select>

  </div>

  <button
    onClick={saveInjection}
    className="mt-6 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold"
  >
    Save Injection
  </button>
</div>

      <div className="mt-10">

  <h2 className="text-2xl font-bold mb-6">

    History

  </h2>

  {logs.length === 0 ? (

    <p className="text-gray-400">

      No Logs Yet

    </p>

  ) : (

    

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

      {logs.map((log) => (

        <div

          key={log.id}

          className="bg-gray-800 rounded-xl p-5 shadow-lg"

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