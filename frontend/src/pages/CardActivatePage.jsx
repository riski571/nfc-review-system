import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { CreditCard, CheckCircle, XCircle } from 'lucide-react'
import axios from 'axios'

export default function CardActivatePage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [card, setCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCard()
  }, [token])

  useEffect(() => {
    if (card && card.status === 'active' && card.destination_url) {
      window.location.href = card.destination_url
    }
  }, [card])

  const fetchCard = async () => {
    try {
      const response = await axios.get(`/api/public/c/${token}`)
      setCard(response.data)
    } catch (error) {
      console.error('Error fetching card:', error)
      setError('Kartu tidak ditemukan')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error && !card) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <CreditCard className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Kartu Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-6">Kartu NFC yang Anda cari tidak valid atau sudah dihapus.</p>
          <Link to="/" className="btn-primary">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    )
  }

  if (card && card.status === 'active') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4 animate-pulse" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Kartu Aktif</h1>
          <p className="text-gray-600">Mengalihkan ke Google Review...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <XCircle className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Kartu Belum Aktif</h1>
        <p className="text-gray-600 mb-6">
          Kartu ini belum diaktifkan. Silakan aktifkan kartu untuk menggunakannya.
        </p>
        <button
          onClick={() => navigate(`/c/${token}/activate`)}
          className="btn-primary"
        >
          Aktivasi Kartu
        </button>
      </div>
    </div>
  )
}
