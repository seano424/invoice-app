import { useRouter } from 'next/dist/client/router'

function Invoice(invoice) {
  const router = useRouter()
  const { id, clientName, paymentDue, total, status } = invoice
  const pending = status === 'pending'
  const paid = status === 'paid'
  const draft = status === 'draft'
  return (
    <div className="bg-white p-5 rounded-lg shadow-lg my-4">
      <div className="flex justify-between items-center mb-4">
        <p className="font-bold">#{id}</p>
        <p className="text-gray-400">{clientName}</p>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-400">Due {paymentDue}</p>
          <p className="font-bold">€ {total}</p>
        </div>
        <div
          className={`flex items-center justify-center space-x-4 w-32 ${
            paid && 'bg-green-50'
          } ${pending && 'bg-yellow-50'} ${
            draft && 'bg-gray-50'
          } bg-opacity-90 rounded-lg px-4 py-2`}
        >
          {/* <FaCircle
            className={`${paid && 'text-green-400'} ${
              pending && 'text-yellow-400'
            } w-3 h-3`}
          /> */}
          <div
            className={`${paid && 'bg-green-400'} ${
              pending && 'bg-yellow-400'
            } w-3 h-3 rounded-full ${draft && 'bg-gray-300'}`}
          />
          <p
            className={`${paid && `text-green-400`} ${
              pending && 'text-yellow-400'
            } font-bold `}
          >
            {status}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Invoice
