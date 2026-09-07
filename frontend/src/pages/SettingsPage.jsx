import { useState, useEffect } from 'react'
import { User, Mail, Save, Key } from 'lucide-react'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [activationCode, setActivationCode] = useState('')
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [codeLoading, setCodeLoading] = useState(true)
  const [codeSaving, setCodeSaving] = useState(false)
  const [codeMessage, setCodeMessage] = useState('')

  useEffect(() => {
    fetchActivationCode()
  }, [])

  const fetchActivationCode = async () => {
    try {
      const response = await api.get('/admin/activation-code')
      setActivationCode(response.data.code)
      setFailedAttempts(response.data.failed_attempts)
      setIsActive(response.data.is_active)
    } catch (error) {
      console.error('Error fetching activation code:', error)
    } finally {
      setCodeLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    
    try {
      await api.put('/auth/me', { name, email })
      setMessage('Profil berhasil diperbarui')
    } catch (error) {
      setMessage('Gagal memperbarui profil')
    } finally {
      setSaving(false)
    }
  }

  const handleCodeSubmit = async (e) => {
    e.preventDefault()
    setCodeSaving(true)
    setCodeMessage('')
    
    try {
      const response = await api.put('/admin/activation-code', { code: activationCode })
      setActivationCode(response.data.code)
      setFailedAttempts(response.data.failed_attempts)
      setIsActive(response.data.is_active)
      setCodeMessage('Kode aktivasi berhasil diperbarui')
    } catch (error) {
      setCodeMessage('Gagal memperbarui kode aktivasi')
    } finally {
      setCodeSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Kelola profil dan preferensi akun Anda</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {message && (
            <div className={`px-4 py-3 rounded-lg text-sm ${
              message.includes('berhasil') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-primary">
            <Save size={18} className="mr-2" />
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Key className="h-6 w-6 text-primary-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Kode Aktivasi Global</h2>
            <p className="text-sm text-gray-500">Kelola kode aktivasi yang digunakan untuk mengaktifkan kartu NFC</p>
          </div>
        </div>

        {codeLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <form onSubmit={handleCodeSubmit} className="space-y-6">
            {codeMessage && (
              <div className={`px-4 py-3 rounded-lg text-sm ${
                codeMessage.includes('berhasil') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {codeMessage}
              </div>
            )}

            <div>
              <label htmlFor="activation_code" className="block text-sm font-medium text-gray-700 mb-1">
                Kode Aktivasi (4 Digit)
              </label>
              <input
                id="activation_code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{4}"
                maxLength={4}
                required
                value={activationCode}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, '').slice(0, 4)
                  setActivationCode(numericValue)
                }}
                className="input text-center text-2xl tracking-widest"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Percobaan Gagal</p>
                <p className="text-2xl font-bold text-gray-900">{failedAttempts} / 3</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Status</p>
                <p className={`text-lg font-semibold ${isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {isActive ? 'Aktif' : 'Tidak Aktif'}
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Penting:</strong> Jika kode aktivasi salah dimasukkan sebanyak 3 kali, kode akan otomatis berganti ke kode baru.
              </p>
            </div>

            <button type="submit" disabled={codeSaving} className="btn-primary">
              <Save size={18} className="mr-2" />
              {codeSaving ? 'Menyimpan...' : 'Simpan Kode Aktivasi'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
