import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { CreditCard, Users, Activity, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import api from '../services/api'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalCards: 0,
    activeCards: 0,
    inactiveCards: 0,
    totalTaps: 0
  })
  const [recentCards, setRecentCards] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [cardsRes] = await Promise.all([
        api.get('/cards/')
      ])
      
      const cards = cardsRes.data
      const activeCards = cards.filter(c => c.status === 'active')
      const inactiveCards = cards.filter(c => c.status === 'inactive')
      const totalTaps = cards.reduce((sum, c) => sum + c.tap_count, 0)
      
      setStats({
        totalCards: cards.length,
        activeCards: activeCards.length,
        inactiveCards: inactiveCards.length,
        totalTaps
      })
      
      setRecentCards(cards.slice(0, 5))
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Kartu NFC',
      value: stats.totalCards,
      icon: CreditCard,
      color: 'bg-blue-500',
      change: '+2',
      changeType: 'positive'
    },
    {
      title: 'Kartu Aktif',
      value: stats.activeCards,
      icon: Activity,
      color: 'bg-green-500',
      change: `${stats.activeCards}`,
      changeType: 'neutral'
    },
    {
      title: 'Kartu Belum Aktif',
      value: stats.inactiveCards,
      icon: CreditCard,
      color: 'bg-yellow-500',
      change: `${stats.inactiveCards}`,
      changeType: 'neutral'
    },
    {
      title: 'Total Tap/Scan',
      value: stats.totalTaps,
      icon: Users,
      color: 'bg-purple-500',
      change: '+12%',
      changeType: 'positive'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Selamat datang di NFC Review Manager</p>
        </div>
        <button
          onClick={() => navigate('/cards')}
          className="btn-primary"
        >
          <Plus size={18} className="mr-2" />
          Buat Kartu Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10`}>
                <stat.icon className={`text-${stat.color.replace('bg-', '')}`} size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {stat.changeType === 'positive' ? (
                <ArrowUpRight className="text-green-500 mr-1" size={16} />
              ) : (
                <ArrowDownRight className="text-red-500 mr-1" size={16} />
              )}
              <span className={stat.changeType === 'positive' ? 'text-green-600' : 'text-gray-600'}>
                {stat.change}
              </span>
              <span className="text-gray-400 ml-1">dari bulan lalu</span>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Nama Bisnis</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Tap Count</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Dibuat</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {recentCards.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    Belum ada kartu NFC. Buat kartu baru untuk memulai.
                  </td>
                </tr>
              ) : (
                recentCards.map((card) => (
                  <tr key={card.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{card.business_name}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        card.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {card.status === 'active' ? 'Aktif' : 'Belum Aktif'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{card.tap_count}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(card.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => navigate(`/cards/${card.id}`)}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Lihat Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
