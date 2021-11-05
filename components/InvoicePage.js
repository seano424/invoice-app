import StatusCard from './StatusCard'
import moment from 'moment'
import { formatter } from '../lib/helpers'
import Button from './Button'
import { modalState, pageState, destroyModalState } from '../atoms/modalAtom'
import { useRecoilState, useSetRecoilState } from 'recoil'
import InvoiceForm from './InvoiceForm'
import DeleteModal from './DeleteModal'
import { updateDoc, doc } from '@firebase/firestore'
import { db } from '../firebase'

function InvoicePage({ invoice, identifier: id }) {
  const {
    clientAddress,
    clientEmail,
    clientName,
    createdAt,
    description,
    items,
    paymentDue,
    paymentTerms,
    senderAddress,
    status,
    total,
  } = invoice
  const setOpen = useSetRecoilState(modalState)
  const setOpenDestroy = useSetRecoilState(destroyModalState)
  const setPage = useSetRecoilState(pageState)

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
  }

  const formattedPaymentDue = moment(paymentDue, 'DD-MM-YYYY').format(
    'DD MMM YYYY'
  )
  const formattedInvoiceDate = moment(createdAt, 'DD-MM-YYYY').format(
    'DD MMM YYYY'
  )

  console.log(invoice)

  return (
    <>
      <DeleteModal invoice={invoice} id={id} />
      <main className="text-secondary font-light p-6">
        {/* Status Card */}
        <div className="flex justify-between items-center bg-white p-5 rounded-lg shadow-sm">
          <p className="text-gray-400">Status</p>
          <StatusCard status={status} />
        </div>
        {/* Main Section */}
        <div className="p-5 my-5 bg-white rounded-lg shadow-sm">
          <div>
            <h3 className="font-bold">
              # <span className="text-black">{invoice.id}</span>
            </h3>
            <p>{description}</p>
          </div>

          {/* Sender Address */}
          <section className="my-5">
            <p>{senderAddress.street}</p>
            <p>{senderAddress.city}</p>
            <p>{senderAddress.postCode}</p>
            <p>{senderAddress.country}</p>
          </section>

          {/* Client and Invoice Details */}
          <section className="flex justify-between my-10 ">
            {/* Column 1 */}
            <article className="flex flex-col justify-between">
              <div className="mb-5">
                <p>Invoice Date</p>
                <h2 className="text-black font-semibold text-xl">
                  {formattedInvoiceDate}
                </h2>
              </div>
              <div>
                <p>Payment Due</p>
                <h2 className="text-black font-semibold text-xl">
                  {formattedPaymentDue}
                </h2>
              </div>
            </article>
            {/* Column 2 */}
            <article>
              <p>Bill To</p>
              <h2 className="text-black font-semibold text-xl">{clientName}</h2>
              <p>{clientAddress.street}</p>
              <p>{clientAddress.city}</p>
              <p>{clientAddress.postCode}</p>
              <p>{clientAddress.country}</p>
            </article>
          </section>

          {/* Client Email */}
          <section>
            <p>Sent to</p>
            <h2 className="text-black font-semibold text-xl">{clientEmail}</h2>
          </section>

          <section className="my-10">
            <div className="bg-purple-50 bg-opacity-60 p-4 rounded-t-lg">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center my-4"
                >
                  <div>
                    <h3 className="text-black font-semibold mb-2">
                      {item.name}
                    </h3>
                    <p className="font-semibold">
                      {item.quantity} x{' '}
                      {typeof item.price === 'number'
                        ? formatter.format(item.price)
                        : total}
                    </p>
                  </div>
                  <h3 className="text-black font-semibold">
                    {typeof item.total === 'number'
                      ? formatter.format(item.total)
                      : total}
                  </h3>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between bg-gray-900 rounded-b-lg p-4">
              <p className=" text-gray-200">Grand Total</p>
              <h1 className="text-2xl text-white font-bold">
                {typeof total === 'number' ? formatter.format(total) : total}
              </h1>
            </div>
          </section>
        </div>
      </main>
      <footer className="flex items-center justify-center w-full h-24 bg-white gap-3">
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
    </>
  )
}

export default InvoicePage
