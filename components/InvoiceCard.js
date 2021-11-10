import { useSetRecoilState } from 'recoil'
import { modalState, pageState } from '../atoms/modalAtom'
import InvoicePage from './InvoicePage'
import StatusCard from './StatusCard'
import { formatter } from '../lib/helpers'
import styles from '@/styles/InvoiceCard.module.css'

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
      <div onClick={handleShow} className={`${styles.card} dark:bg-black`}>
        <div className={styles.cardDetailsTop}>
          <p>#{id}</p>
          <p>{clientName}</p>
        </div>
        <div className={styles.cardDetailsBottom}>
          <div>
            <p>Due {paymentDue}</p>
            <p>{typeof total === 'number' ? formatter.format(total) : total}</p>
          </div>
          <StatusCard status={status} />
        </div>
      </div>
    </>
  )
}

export default Invoice
