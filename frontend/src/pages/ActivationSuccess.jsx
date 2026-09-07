import { Link } from 'react-router-dom'
import { CheckCircle, Home, ExternalLink } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function ActivationSuccess() {
  const { token } = useParams()
  const [card, setCard] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCard()
  }, [token])

  const fetchCard = async () => {
    try {
      const response = await axios.get(`/api/public/c/${token}`)
      setCard(response.data)
    } catch (error) {
      console.error('Error fetching card:', error)
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

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <CheckCircle className="mx-auto h-20 w-20 text-green-500 mb-6 animate-bounce" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Aktivasi Berhasil!</h1>
        <p className="text-xl text-gray-600 mb-2">Kartu NFC Anda telah berhasil diaktifkan</p>
        {card && (
          <p className="text-lg text-gray-500 mb-8">
            Toko: <span className="font-semibold text-gray-700">{card.business_name}</span>
          </p>
        )}
        <div className="flex items-center justify-center gap-4">
          {card && card.destination_url && (
            <a
              href={card.destination_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center gap-2"
            >
              <ExternalLink size={18} />
              Kunjungi Google Review
            </a>
          )}
          <Link to="/" className="btn-secondary flex items-center gap-2">
            <Home size={18} />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}