import { useEffect, useState } from 'react'
import { api } from '../services/api'

export default function BlockedUsers() {

  const [blockedUsers, setBlockedUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const loadBlockedUsers = async () => {
    try {
      const user = await api.getMe()

      setBlockedUsers(user.blockedUsers || [])

    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUnblock = async (userId) => {
    try {

      await api.blockUser(userId)

      setBlockedUsers(
        blockedUsers.filter(user => user._id !== userId)
      )

    } catch (error) {
      alert(error.message)
    }
  }

  useEffect(() => {
    loadBlockedUsers()
  }, [])

  if (loading) {
    return <p>Loading blocked users...</p>
  }

  return (
    <main className="container">

      <div className="card">

        <h1>Blocked Users</h1>

        {blockedUsers.length === 0 ? (

          <p>You haven't blocked anyone.</p>

        ) : (

          blockedUsers.map(user => (

            <div className="card" key={user._id}>

              <strong>
                {user.name}
              </strong>

              <p>
                @{user.name}
              </p>

              <button
                onClick={() => handleUnblock(user._id)}
              >
                Unblock
              </button>

            </div>

          ))

        )}

      </div>

    </main>
  )
}