import { useSetRecoilState } from 'recoil'
import { modalState, pageState } from '../atoms/modalAtom'
import InvoicePage from './InvoicePage'
import StatusCard from './StatusCard'
import { formatter } from '../lib/helpers'

function Invoice(invoice) {
  const setOpen = useSetRecoilState(modalState)
  const setPage = useSetRecoilState(pageState)
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
        onClick={handleShow}
        className="bg-white dark:bg-dark p-5 rounded-lg shadow-lg my-4"
      >
        <div className="flex justify-between items-center mb-4">
          <p className="font-bold">#{id}</p>
          <p className="text-gray-400">{clientName}</p>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400 my-2">Due {paymentDue}</p>
            <p className="font-bold">{formatter.format(total)}</p>
          </div>
          <StatusCard status={status} />
        </div>
      </div>
    </>
  )
}

export default Invoice
