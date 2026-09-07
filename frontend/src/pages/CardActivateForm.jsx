import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react'
import axios from 'axios'

export default function CardActivateForm() {
  const { token } = useParams()
  const [card, setCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    business_name: '',
    place_id: '',
    google_place_url: '',
    activation_code: ''
  })

  useEffect(() => {
    fetchCard()
  }, [token])

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const response = await axios.post(`/api/public/c/${token}/activate`, {
        business_name: formData.business_name,
        place_id: formData.place_id,
        google_place_url: formData.google_place_url,
        activation_code: formData.activation_code
      })
      
      if (response.data) {
        window.location.href = `/c/${token}/success`
      }
    } catch (error) {
      console.error('Error activating card:', error)
      setError(error.response?.data?.detail || 'Gagal mengaktifkan kartu. Periksa kode aktivasi Anda.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'activation_code') {
      const numericValue = value.replace(/\D/g, '').slice(0, 4)
      setFormData({ ...formData, [name]: numericValue })
    } else if (name === 'place_id') {
      const trimmed = value.trim()
      setFormData({
        ...formData,
        [name]: trimmed,
        google_place_url: trimmed ? `https://search.google.com/local/writereview?placeid=${trimmed}` : ''
      })
    } else {
      setFormData({ ...formData, [name]: value })
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
    if (card.destination_url) {
      window.location.href = card.destination_url
    }
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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="card">
          <div className="text-center mb-8">
            <CreditCard className="mx-auto h-12 w-12 text-primary-600 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900">Aktivasi Kartu NFC</h2>
            <p className="mt-2 text-gray-600">Isi formulir berikut untuk mengaktifkan kartu Anda</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="business_name" className="block text-sm font-medium text-gray-700 mb-1">
                Nama Toko <span className="text-red-500">*</span>
              </label>
              <input
                id="business_name"
                name="business_name"
                type="text"
                required
                value={formData.business_name}
                onChange={handleChange}
                className="input"
                placeholder="Contoh: Warung Makan Sederhana"
              />
            </div>

            <div>
              <label htmlFor="place_id" className="block text-sm font-medium text-gray-700 mb-1">
                Place ID <span className="text-red-500">*</span>
              </label>
              <input
                id="place_id"
                name="place_id"
                type="text"
                required
                value={formData.place_id}
                onChange={handleChange}
                className="input"
                placeholder="Contoh: ChIJN1t_tDeuEmsRUsoyG83frY4"
              />
            </div>

            <div>
              <label htmlFor="google_place_url" className="block text-sm font-medium text-gray-700 mb-1">
                URL Google Place <span className="text-red-500">*</span>
              </label>
              <input
                id="google_place_url"
                name="google_place_url"
                type="url"
                required
                value={formData.google_place_url}
                onChange={handleChange}
                className="input"
                placeholder="https://maps.google.com/..."
              />
            </div>

            <div>
              <label htmlFor="activation_code" className="block text-sm font-medium text-gray-700 mb-1">
                Kode Aktivasi <span className="text-red-500">*</span>
              </label>
              <input
                id="activation_code"
                name="activation_code"
                type="password"
                inputMode="numeric"
                pattern="[0-9]{4}"
                maxLength={4}
                required
                value={formData.activation_code}
                onChange={handleChange}
                className="input text-center text-2xl tracking-widest"
                placeholder="____"
                autoComplete="off"
              />
              <p className="mt-1 text-xs text-gray-500">Masukkan 4 digit kode aktivasi</p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary py-3"
            >
              {submitting ? 'Mengaktifkan...' : 'Aktifkan Kartu'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}