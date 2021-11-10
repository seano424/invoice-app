import StatusCard from './StatusCard'
import moment from 'moment'
import { formatter } from '../lib/helpers'
import Button from './Button'
import { modalState, pageState, destroyModalState } from '../atoms/modalAtom'
import { paidState, pendingState, draftState } from '../atoms/filterAtom'
import { useSetRecoilState } from 'recoil'
import InvoiceForm from './InvoiceForm'
import DeleteModal from './DeleteModal'
import { updateDoc, doc } from '@firebase/firestore'
import { db } from '../firebase'
import styles from '@/styles/InvoicePage.module.css'

function InvoicePage({ invoice, identifier: id }) {
  const {
    clientAddress,
    clientEmail,
    clientName,
    createdAt,
    description,
    items,
    paymentDue,
    senderAddress,
    status,
    total,
  } = invoice
  const setOpen = useSetRecoilState(modalState)
  const setOpenDestroy = useSetRecoilState(destroyModalState)
  const setPage = useSetRecoilState(pageState)
  const setPaid = useSetRecoilState(paidState)
  const setPending = useSetRecoilState(pendingState)
  const setDraft = useSetRecoilState(draftState)

  const handleEdit = () => {
    setPage(
      <InvoiceForm
        type="edit"
        header="Edit Invoice"
        invoice={invoice}
        identifier={id}
      />
    )
    setOpen(true)
  }

  const openDestroyModal = () => {
    setOpenDestroy(true)
  }

  const handleMarkAsPaid = async (invoice) => {
    const invoiceRef = doc(db, 'invoices', id)

    const invoiceData = {
      ...invoice,
      status: 'paid',
    }

    console.log('invoiceData:', invoiceData)

    const docRef = await updateDoc(invoiceRef, {
      invoice: invoiceData,
    })

    console.log('new doc updated', docRef)
    setOpen(false)
    setPaid(false)
    setPending(false)
    setDraft(false)
  }

  const formattedPaymentDue = moment(paymentDue, 'DD-MM-YYYY').format(
    'DD MMM YYYY'
  )
  const formattedInvoiceDate = moment(createdAt, 'DD-MM-YYYY').format(
    'DD MMM YYYY'
  )

  return (
    <div className={styles.container}>
      <DeleteModal invoice={invoice} id={id} />
      <main className={styles.main}>
        {/* Status Card */}
        <section className={`${styles.status} dark:bg-dark`}>
          <p>Status</p>
          <StatusCard status={status} />
        </section>
        {/* Main Section */}
        <section className={`${styles.info} dark:bg-dark dark:text-gray-200`}>
          <article>
            <div>
              <h3 className={styles.header}>
                # <span className="dark:text-white">{invoice.id}</span>
              </h3>
              <p>{description}</p>
            </div>

            {/* Sender Address */}
            <div className="my-5">
              <p>{senderAddress.street}</p>
              <p>{senderAddress.city}</p>
              <p>{senderAddress.postCode}</p>
              <p>{senderAddress.country}</p>
            </div>

            {/* Client and Invoice Details */}
            <div className={styles.clientDetails}>
              {/* Column 1 */}
              <div className={styles.col}>
                <div>
                  <p>Invoice Date</p>
                  <h2 className="dark:text-white">{formattedInvoiceDate}</h2>
                </div>
                <div>
                  <p>Payment Due</p>
                  <h2 className="dark:text-white">{formattedPaymentDue}</h2>
                </div>
              </div>
              {/* Column 2 */}
              <div className={styles.col}>
                <p>Bill To</p>
                <h2 className="dark:text-white">{clientName}</h2>
                <p>{clientAddress.street}</p>
                <p>{clientAddress.city}</p>
                <p>{clientAddress.postCode}</p>
                <p>{clientAddress.country}</p>
              </div>
            </div>

            {/* Client Email */}
            <div className={styles.col}>
              <p>Sent to</p>
              <h2 className="dark:text-white">{clientEmail}</h2>
            </div>
          </article>

          <article className="my-10">
            <div className={`${styles.items} dark:bg-dark2`}>
              {items.map((item, idx) => (
                <div key={idx} className={styles.itemContainer}>
                  <div className={styles.item}>
                    <h3 className="dark:text-white">{item.name}</h3>
                    <p>
                      {item.quantity} x{' '}
                      {typeof item.price === 'number'
                        ? formatter.format(item.price)
                        : total}
                    </p>
                  </div>
                  <h3 className="dark:text-white">
                    {typeof item.total === 'number'
                      ? formatter.format(item.total)
                      : total}
                  </h3>
                </div>
              ))}
            </div>
            <div className={`${styles.totals} dark:bg-black`}>
              <p>Grand Total</p>
              <h1>
                {typeof total === 'number' ? formatter.format(total) : total}
              </h1>
            </div>
          </article>
        </section>
      </main>
      <footer className={`${styles.footer} dark:bg-dark`}>
        <div onClick={handleEdit}>
          <Button text="Edit" textColor="text-gray-500" bgColor="bg-gray-50" />
        </div>
        <div onClick={openDestroyModal}>
          <Button text="Delete" textColor="text-white" bgColor="bg-red-500" />
        </div>
        <div onClick={() => handleMarkAsPaid(invoice)}>
          <Button
            text="Mark as Paid"
            textColor="text-white"
            bgColor="bg-primary"
          />
        </div>
      </footer>
    </div>
  )
}

export default InvoicePage
