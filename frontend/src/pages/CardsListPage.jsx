import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, MoreVertical, QrCode, Edit2, Trash2, ExternalLink } from 'lucide-react'
import api from '../services/api'
import QRCodeModal from '../components/QRCodeModal'
import CardModal from '../components/CardModal'

export default function CardsListPage() {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchCards()
  }, [])

  const fetchCards = async () => {
    try {
      const response = await api.get('/cards/')
      setCards(response.data)
    } catch (error) {
      console.error('Error fetching cards:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (cardId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kartu ini?')) return
    
    try {
      await api.delete(`/cards/${cardId}`)
      setCards(cards.filter(c => c.id !== cardId))
    } catch (error) {
      console.error('Error deleting card:', error)
    }
  }

  const handleToggleStatus = async (card) => {
    try {
      const newStatus = card.status === 'active' ? 'inactive' : 'active'
      await api.put(`/cards/${card.id}`, { status: newStatus })
      setCards(cards.map(c => c.id === card.id ? { ...c, status: newStatus } : c))
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const filteredCards = cards.filter(card =>
    card.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.token.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kartu NFC</h1>
          <p className="text-gray-500 mt-1">Kelola semua kartu NFC Anda</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          <Plus size={18} className="mr-2" />
          Buat Kartu Baru
        </button>
      </div>

      <div className="card">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari kartu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 max-w-md"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Nama Bisnis</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Token</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">URL</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Tap</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Dibuat</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredCards.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    {searchQuery ? 'Tidak ada kartu yang cocok' : 'Belum ada kartu. Buat kartu baru untuk memulai.'}
                  </td>
                </tr>
              ) : (
                filteredCards.map((card) => (
                  <tr key={card.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{card.business_name}</td>
                    <td className="py-3 px-4">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">{card.token}</code>
                    </td>
                    <td className="py-3 px-4">
                      {card.destination_url ? (
                        <a href={card.destination_url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 flex items-center gap-1 text-sm">
                          <ExternalLink size={14} />
                          Link
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(card)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
                          card.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {card.status === 'active' ? 'Aktif' : 'Belum Aktif'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{card.tap_count}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(card.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/cards/${card.id}`)}
                          className="p-1 text-gray-600 hover:text-primary-600"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCard(card)
                            setShowQRModal(true)
                          }}
                          className="p-1 text-gray-600 hover:text-primary-600"
                          title="QR Code"
                        >
                          <QrCode size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(card.id)}
                          className="p-1 text-gray-600 hover:text-red-600"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <CardModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchCards}
        />
      )}

      {showQRModal && selectedCard && (
        <QRCodeModal
          card={selectedCard}
          onClose={() => {
            setShowQRModal(false)
            setSelectedCard(null)
          }}
        />
      )}
    </div>
  )
}
