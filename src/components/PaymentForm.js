import React from 'react'

export default function PaymentForm({ onClose }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Payment simulated — thank you!')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-[420px]">
        <h3 className="text-xl font-bold mb-4">Payment</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input required placeholder="Full name" className="w-full border px-3 py-2 rounded"/>
          <input required placeholder="Card number" className="w-full border px-3 py-2 rounded"/>
          <div className="flex gap-2">
            <input required placeholder="MM/YY" className="w-1/2 border px-3 py-2 rounded"/>
            <input required placeholder="CVC" className="w-1/2 border px-3 py-2 rounded"/>
          </div>
          <div className="flex gap-2">
            <button className="btn bg-accent text-white px-4 py-2 rounded">Pay</button>
            <button type="button" onClick={onClose} className="btn border px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
