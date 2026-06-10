'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  const [weight, setWeight] = useState('')
  const [water, setWater] = useState('')
  const [steps, setSteps] = useState('')
  const [protein, setProtein] = useState('')
  const [calories, setCalories] = useState('')

  useEffect(() => {
    const savedData = localStorage.getItem('dailyLog')

    if (savedData) {
      const data = JSON.parse(savedData)

      setWeight(data.weight || '')
      setWater(data.water || '')
      setSteps(data.steps || '')
      setProtein(data.protein || '')
      setCalories(data.calories || '')
    }
  }, [])

  const saveData = () => {
    localStorage.setItem(
      'dailyLog',
      JSON.stringify({
        weight,
        water,
        steps,
        protein,
        calories,
      })
    )

    alert('Daily Log Saved ✅')
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-6xl font-bold">
        GLP Tracker
      </h1>

      <p className="mt-2 text-gray-400 text-xl">
        Personal Weight Loss Dashboard
      </p>

      {/* Daily Log */}
      <div className="mt-8 bg-gray-900 p-6 rounded-2xl max-w-4xl">
        <h2 className="text-2xl font-semibold mb-6">
          Daily Log
        </h2>

        <div className="grid grid-cols-2 gap-4">
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
            className="p-3 rounded-lg bg-white text-black col-span-2"
          />
        </div>

        <button
          onClick={saveData}
          className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
        >
          Save Daily Log
        </button>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">

        <div className="bg-gray-900 p-5 rounded-2xl">
          <p className="text-gray-400">Weight</p>
          <p className="text-4xl font-bold text-green-400">
            {weight || '--'}
          </p>
          <p className="text-gray-500">kg</p>
        </div>

        <div className="bg-gray-900 p-5 rounded-2xl">
          <p className="text-gray-400">Water</p>
          <p className="text-4xl font-bold text-blue-400">
            {water || '--'}
          </p>
          <p className="text-gray-500">L</p>
        </div>

        <div className="bg-gray-900 p-5 rounded-2xl">
          <p className="text-gray-400">Steps</p>
          <p className="text-4xl font-bold text-yellow-400">
            {steps || '--'}
          </p>
          <p className="text-gray-500">steps</p>
        </div>

        <div className="bg-gray-900 p-5 rounded-2xl">
          <p className="text-gray-400">Protein</p>
          <p className="text-4xl font-bold text-purple-400">
            {protein || '--'}
          </p>
          <p className="text-gray-500">g</p>
        </div>

        <div className="bg-gray-900 p-5 rounded-2xl">
          <p className="text-gray-400">Calories</p>
          <p className="text-4xl font-bold text-red-400">
            {calories || '--'}
          </p>
          <p className="text-gray-500">kcal</p>
        </div>

      </div>

      {/* Goal Card */}
      <div className="mt-8 bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-2xl max-w-4xl">
        <h2 className="text-2xl font-bold">
          Weekly Goal
        </h2>

        <p className="mt-2 text-lg">
          Goal Weight: 80 kg
        </p>

        <p className="text-lg">
          Current Weight: {weight || '--'} kg
        </p>
      </div>
    </main>
  )
}