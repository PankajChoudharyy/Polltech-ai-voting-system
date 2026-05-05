import { useEffect } from 'react'
import { supabase } from './lib/supabase'  // ❗ FIX PATH

function App() {

  useEffect(() => {
  const fetchCandidates = async () => {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')

    if (error) {
      console.error("ERROR:", error)
    } else {
      console.log("DATA:", data)
    }
  }

  fetchCandidates()
}, [])