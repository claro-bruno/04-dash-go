import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

export default function Dash() {
  const { user } = useContext(AuthContext)
  return <h1>Dash: {user?.email} </h1>
}
