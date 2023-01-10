import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { withSSRAuth } from '../utils/withSSRAuth'

export default function Dash() {
  const { user } = useContext(AuthContext)
  return <h1>Dash: {user?.email} </h1>
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {},
  }
})
