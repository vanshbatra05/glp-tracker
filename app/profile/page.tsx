'use client'
import Navbar from '../components/navbar'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [goalWeight, setGoalWeight] = useState('')
  const [medication, setMedication] = useState('')
  const [dose, setDose] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    setProfile(data)

    setGoalWeight(
    data?.goal_weight?.toString() || ''
    )

    setMedication(
    data?.medication || ''
    )

    setDose(
    data?.dose || ''
    )


  fetchProfile()
    }
    async function saveProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  const { error } = await supabase
    .from('profiles')
    .update({
      goal_weight: Number(goalWeight),
      medication,
      dose,
    })
    .eq('id', user.id)

  if (error) {
    alert(error.message)
    return
  }

  alert('Profile Saved ✅')
}

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
        <Navbar/>
      <h1 className="text-4xl font-bold mb-6">
        👤 Profile
      </h1>

      {profile && (
        <div className="bg-gray-900 p-6 rounded-2xl">
          <p>
            <strong>Email:</strong> {profile.email}
          </p>

         <div className="mt-4">
  <label>Goal Weight</label>

  <input
    type="number"
    value={goalWeight}
    onChange={(e) =>
      setGoalWeight(e.target.value)
    }
    className="w-full mt-2 p-3 rounded-lg bg-white text-black"
  />
</div>

<div className="mt-4">
  <label>Medication</label>

  <select
    value={medication}
    onChange={(e) =>
      setMedication(e.target.value)
    }
    className="w-full mt-2 p-3 rounded-lg bg-white text-black"
  >
    <option value="">Select</option>
    <option>Mounjaro</option>
    <option>Ozempic</option>
    <option>Wegovy</option>
    <option>Zepbound</option>
    <option>Rybelsus</option>
  </select>
</div>

<div className="mt-4">
  <label>Dose</label>

  <select
    value={dose}
    onChange={(e) =>
      setDose(e.target.value)
    }
    className="w-full mt-2 p-3 rounded-lg bg-white text-black"
  >
    <option value="">Select</option>
    <option>2.5 mg</option>
    <option>5 mg</option>
    <option>7.5 mg</option>
    <option>10 mg</option>
    <option>12.5 mg</option>
    <option>15 mg</option>
  </select>
</div>

<button
  onClick={saveProfile}
  className="mt-6 bg-blue-600 px-6 py-3 rounded-lg"
>
  Save Profile
</button>
        </div>
      )}
    </main>
  )
}