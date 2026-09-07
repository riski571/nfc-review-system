import { useState } from 'react'
import { X } from 'lucide-react'
import api from '../services/api'

export default function CardModal({ onClose, onSuccess }) {
  const [businessName, setBusinessName] = useState('')
  const [destinationUrl, setDestinationUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      await api.post('/cards/', {
        business_name: businessName,
        destination_url: destinationUrl || null
      })
      onSuccess()
      onClose()
    } catch (error) {
      const detail = error.response?.data?.detail || error.message || 'Gagal membuat kartu'
      console.error('Create card error:', error.response || error)
      setError(detail)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Buat Kartu Baru</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Bisnis
            </label>
            <input
              id="businessName"
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="input"
              placeholder="Contoh: Toko Serba Ada"
            />
          </div>

          <div>
            <label htmlFor="destinationUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Google Review URL
            </label>
            <input
              id="destinationUrl"
              type="url"
              value={destinationUrl}
              onChange={(e) => setDestinationUrl(e.target.value)}
              className="input"
              placeholder="https://g.page/r/CSkL4example"
            />
            <p className="text-xs text-gray-500 mt-1">
              Bisa diisi nanti saat aktivasi
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 btn-secondary">
              Batal
            </button>
            <button type="submit" disabled={loading} className="flex-1 btn-primary">
              {loading ? 'Membuat...' : 'Buat Kartu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
