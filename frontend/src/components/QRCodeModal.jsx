import { QRCodeCanvas } from 'qrcode.react'
import { Download, X } from 'lucide-react'

export default function QRCodeModal({ card, onClose }) {
  const cardUrl = `${window.location.origin}/c/${card.token}`

  const handleDownload = () => {
    const canvas = document.getElementById('qr-code-canvas')
    const link = document.createElement('a')
    link.download = `qr-code-${card.token}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">QR Code</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="text-center">
          <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-300 inline-block mb-4">
            <QRCodeCanvas
              id="qr-code-canvas"
              value={cardUrl}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>
          <p className="text-sm text-gray-600 mb-2 break-all">{cardUrl}</p>
          <p className="text-xs text-gray-400 mb-6">QR Code ini mengarahkan ke halaman review bisnis Anda</p>
          
          <button
            onClick={handleDownload}
            className="btn-primary w-full"
          >
            <Download size={18} className="mr-2" />
            Unduh QR Code
          </button>
        </div>
      </div>
    </div>
  )
}
