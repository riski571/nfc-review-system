import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, QrCode, Copy, ExternalLink, Trash2, CheckCircle } from 'lucide-react'
import api from '../services/api'
import QRCodeModal from '../components/QRCodeModal'

export default function CardDetailPage() {
  const { id } = useParams()
  const [card, setCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showQRModal, setShowQRModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activating, setActivating] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCard()
  }, [id])

  const fetchCard = async () => {
    try {
      const response = await api.get(`/cards/${id}`)
      setCard(response.data)
    } catch (error) {
      console.error('Error fetching card:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const formData = new FormData(e.target)
      const updateData = {
        business_name: formData.get('business_name'),
      }
      const url = formData.get('destination_url')
      if (url) {
        updateData.destination_url = url
      }
      
      const response = await api.put(`/cards/${id}`, updateData)
      setCard(response.data)
      alert('Kartu berhasil diperbarui')
    } catch (error) {
      console.error('Error updating card:', error)
      alert('Gagal memperbarui kartu')
    } finally {
      setSaving(false)
    }
  }

  const handleActivate = async () => {
    if (!confirm('Apakah Anda yakin ingin mengaktifkan kartu ini?')) return
    setActivating(true)
    
    try {
      const response = await api.post(`/cards/${id}/activate`)
      setCard(response.data)
      alert('Kartu berhasil diaktifkan!')
    } catch (error) {
      console.error('Error activating card:', error)
      alert('Gagal mengaktifkan kartu')
    } finally {
      setActivating(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus kartu ini?')) return
    
    try {
      await api.delete(`/cards/${id}`)
      navigate('/cards')
    } catch (error) {
      console.error('Error deleting card:', error)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert('Disalin ke clipboard!')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!card) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Kartu tidak ditemukan</p>
        <button onClick={() => navigate('/cards')} className="btn-primary mt-4">
          Kembali ke Daftar Kartu
        </button>
      </div>
    )
  }

  const cardUrl = `${window.location.origin}/c/${card.token}`

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/cards')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Detail Kartu NFC</h1>
          <p className="text-gray-500 mt-1">Kelola dan pantau kartu Anda</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="business_name" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Bisnis
            </label>
            <input
              id="business_name"
              name="business_name"
              type="text"
              required
              defaultValue={card.business_name}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="destination_url" className="block text-sm font-medium text-gray-700 mb-1">
              Google Review URL
            </label>
            <input
              id="destination_url"
              name="destination_url"
              type="url"
              defaultValue={card.destination_url || ''}
              className="input"
              placeholder="https://g.page/r/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Kartu
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={cardUrl}
                readOnly
                className="input bg-gray-50"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(cardUrl)}
                className="btn-secondary px-3"
                title="Salin URL"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Token
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={card.token}
                readOnly
                className="input bg-gray-50 font-mono text-sm"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(card.token)}
                className="btn-secondary px-3"
                title="Salin Token"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                card.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {card.status === 'active' ? 'Aktif' : 'Belum Aktif'}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Tap</label>
              <p className="text-gray-900 font-medium">{card.tap_count}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dibuat</label>
            <p className="text-gray-900">{new Date(card.created_at).toLocaleString('id-ID')}</p>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
            
            {card.status !== 'active' && (
              <button
                type="button"
                onClick={handleActivate}
                disabled={activating}
                className="btn-primary bg-green-600 hover:bg-green-700"
              >
                <CheckCircle size={18} className="mr-2" />
                {activating ? 'Mengaktifkan...' : 'Aktifkan Kartu'}
              </button>
            )}
            
            <button
              type="button"
              onClick={() => setShowQRModal(true)}
              className="btn-secondary"
            >
              <QrCode size={18} className="mr-2" />
              Lihat QR Code
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="btn-secondary text-red-600 hover:text-red-700 ml-auto"
            >
              <Trash2 size={18} className="mr-2" />
              Hapus
            </button>
          </div>
        </form>
      </div>

      {showQRModal && (
        <QRCodeModal
          card={card}
          onClose={() => setShowQRModal(false)}
        />
      )}
    </div>
  )
}
