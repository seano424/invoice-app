import { useRecoilState } from 'recoil'
import { modalState, pageState } from '../atoms/modalAtom'
import InvoicePage from './InvoicePage'
import StatusCard from './StatusCard'

function Invoice(invoice) {
  const [_, setOpen] = useRecoilState(modalState)
  const [page, setPage] = useRecoilState(pageState)
  const { id, clientName, paymentDue, total, status } = invoice.invoice

  const handleShow = () => {
    setOpen(true)
    setPage(
      <InvoicePage identifier={invoice.identifier} invoice={invoice.invoice} />
    )
  }

  return (
    <>
      <div
        // onClick={handleEdit}
        onClick={handleShow}
        className="bg-white p-5 rounded-lg shadow-lg my-4"
      >
        <div className="flex justify-between items-center mb-4">
          <p className="font-bold">#{id}</p>
          <p className="text-gray-400">{clientName}</p>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400">Due {paymentDue}</p>
            <p className="font-bold">€ {total}</p>
          </div>
          <StatusCard status={status} />
        </div>
      </div>
    </>
  )
}

export default Invoice