import { Link } from 'react-router-dom'
import { CreditCard, Smartphone, Globe, QrCode, Shield, Zap } from 'lucide-react'

export default function LandingPage() {
  const features = [
    {
      icon: Smartphone,
      title: 'NFC Tap',
      description: 'Pelanggan cukup tap kartu NFC ke smartphone untuk langsung diarahkan ke Google Review'
    },
    {
      icon: QrCode,
      title: 'QR Code',
      description: 'QR Code yang bisa dipindai untuk mengarahkan pelanggan ke review bisnis Anda'
    },
    {
      icon: Globe,
      title: 'Google Review',
      description: 'Tingkatkan rating dan ulasan Google Review bisnis Anda dengan mudah'
    },
    {
      icon: Shield,
      title: 'Aman & Terpercaya',
      description: 'Sistem keamanan dengan token unik dan JWT authentication'
    },
    {
      icon: Zap,
      title: 'Cepat & Mudah',
      description: 'Setup dalam hitungan menit, tanpa perlu coding'
    },
    {
      icon: CreditCard,
      title: 'Dashboard Admin',
      description: 'Kelola semua kartu NFC dan pantau statistik tap dari satu tempat'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <CreditCard className="text-primary-600" size={28} />
              <span className="text-xl font-bold text-gray-900">NFC Review Manager</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                Masuk
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-20 pb-32 bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Tingkatkan{' '}
            <span className="text-primary-600">Google Review</span>
            <br />
            dengan NFC & QR Code
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Solusi lengkap untuk mengelola kartu NFC dan QR Code yang mengarahkan pelanggan ke halaman review Google bisnis Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="btn-primary px-8 py-3 text-lg">
              Masuk ke Dashboard
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Fitur Unggulan
            </h2>
            <p className="text-lg text-gray-600">
              Semua yang Anda butuhkan untuk mengelola NFC Review dalam satu platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="text-primary-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Siap Meningkatkan Review Bisnis?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Bergabung dengan ratusan bisnis yang sudah menggunakan NFC Review Manager untuk mendapatkan lebih banyak ulasan Google.
          </p>
          <Link to="/login" className="btn-primary px-8 py-3 text-lg">
            Masuk Sekarang
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p> NFC Review Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
