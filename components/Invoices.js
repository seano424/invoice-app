import { useState, useEffect, useRef } from 'react'
import { signIn, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRecoilState, useRecoilValue } from 'recoil'
import { collection, onSnapshot, query, where } from '@firebase/firestore'
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/solid'
import InvoiceCard from './InvoiceCard'
import { db } from '../firebase'
import { modalState, pageState } from '../atoms/modalAtom'
import { trialModeState } from '../atoms/trialModeAtom'
import { paidState, pendingState, draftState } from '../atoms/filterAtom'
import Modal from './Modal'
import InvoiceForm from './InvoiceForm'
import useOutsideClick from '../hooks/useOutsideClick'

function Invoices() {
  const [invoices, setInvoices] = useState([])
  const { data: session } = useSession()
  const [_, setOpen] = useRecoilState(modalState)
  const trialMode = useRecoilValue(trialModeState)
  const [page, setPage] = useRecoilState(pageState)
  const [filterPaid, setFilterPaid] = useRecoilState(paidState)
  const [filterPending, setFilterPending] = useRecoilState(pendingState)
  const [filterDraft, setFilterDraft] = useRecoilState(draftState)
  const [showFilter, setShowFilter] = useState(false)
  const filterRef = useRef()

  console.log('trialMode', trialMode)

  useOutsideClick(filterRef, () => {
    setShowFilter(false)
  })

  const paidInvoices = invoices.filter(
    (i) => i.data().invoice.status === 'paid'
  )
  const paidAndPendingInvoices = invoices.filter(
    (i) =>
      i.data().invoice.status === 'paid' ||
      i.data().invoice.status === 'pending'
  )
  const paidAndDraftInvoices = invoices.filter(
    (i) =>
      i.data().invoice.status === 'paid' || i.data().invoice.status === 'draft'
  )

  const pendingInvoices = invoices.filter(
    (i) => i.data().invoice.status === 'pending'
  )
  const pendingAndDraftInvoices = invoices.filter(
    (i) =>
      i.data().invoice.status === 'pending' ||
      i.data().invoice.status === 'draft'
  )

  const draftInvoices = invoices.filter(
    (i) => i.data().invoice.status === 'draft'
  )

  useEffect(() => {
    session &&
      !trialMode &&
      onSnapshot(
        query(collection(db, 'invoices'), where('uid', '==', session.user.uid)),
        (querySnapshot) => {
          setInvoices(querySnapshot.docs)
          const showInvoices = []
          querySnapshot.forEach((doc) => {
            showInvoices.push(doc.data())
          })
          console.log('invoices', showInvoices)
        }
      )

    trialMode &&
      onSnapshot(query(collection(db, 'invoices')), (snapshot) => {
        setInvoices(snapshot.docs)
      })

    !session && !trialMode && setInvoices([])
  }, [db, session, trialMode])

  const handleNew = () => {
    setPage(<InvoiceForm type="new" header="New Invoice" />)
    setOpen(true)
  }

  return (
    <>
      <Modal page={page} />
      <main className="max-w-full overflow-y-auto scrollbar-hide md:max-w-3xl xl:w-screen mx-auto pt-[4.5rem] h-screen">
        {/* Top Part */}
        <section className="flex justify-between space-x-10 my-4">
          <div>
            <h4 className="text-xl font-bold">Invoices</h4>
            <p>
              <span className="hidden sm:inline-block"> There are </span>{' '}
              {invoices.length} invoices
            </p>
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center space-x-4">
            <div
              ref={filterRef}
              className="flex relative items-center space-x-2"
            >
              <div
                onClick={() => setShowFilter(!showFilter)}
                className="flex space-x-2 items-center cursor-pointer"
              >
                <p className="font-bold">
                  Filter{' '}
                  <span className="hidden sm:inline-flex">by status</span>{' '}
                </p>
                <ChevronDownIcon className="h-8 w-8 cursor-pointer" />
              </div>
              {showFilter && (
                <div className="absolute bg-white shadow-lg pl-10 pr-24 py-6 rounded-xl top-12 mt-2 -left-12">
                  <div className="flex items-center space-x-3">
                    <input
                      onChange={() => setFilterDraft(!filterDraft)}
                      type="checkbox"
                      className="focus:ring-0  text-primary"
                      id="draft"
                      name="draft"
                      checked={filterDraft}
                    />
                    <label for="scales">Draft</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      onChange={() => setFilterPending(!filterPending)}
                      className="focus:ring-0  text-primary"
                      type="checkbox"
                      id="pending"
                      name="pending"
                      checked={filterPending}
                    />
                    <label for="scales">Pending</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      onChange={() => setFilterPaid(!filterPaid)}
                      className="focus:ring-0  text-primary"
                      type="checkbox"
                      id="paid"
                      name="paid"
                      checked={filterPaid}
                    />
                    <label for="scales">Paid</label>
                  </div>
                </div>
              )}
            </div>

            {/* New Invoice Button */}
            <div onClick={() => !session && !trialMode && signIn()}>
              <button
                onClick={handleNew}
                className="flex space-x-2 items-center bg-primary p-2 rounded-full cursor-pointer"
              >
                <span className="bg-white  flex items-center justify-center w-8 h-8 rounded-full">
                  <PlusIcon className="dark:text-black" />
                </span>
                <span className="text-white">New</span>
              </button>
            </div>
          </div>
        </section>

        {/* Individual invoices */}
        <section>
          {!invoices.length && (
            <div className="relative h-80 xl:h-[25rem] w-full">
              <Image src="/images/nothing-here.svg" layout="fill" />
            </div>
          )}
          {!filterDraft &&
            !filterPaid &&
            !filterPending &&
            invoices?.map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                identifier={invoice.id}
                invoice={invoice.data().invoice}
              />
            ))}
          {filterDraft &&
            !filterPaid &&
            !filterPending &&
            draftInvoices?.map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                identifier={invoice.id}
                invoice={invoice.data().invoice}
              />
            ))}
          {!filterDraft &&
            filterPaid &&
            !filterPending &&
            paidInvoices?.map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                identifier={invoice.id}
                invoice={invoice.data().invoice}
              />
            ))}
          {!filterDraft &&
            !filterPaid &&
            filterPending &&
            pendingInvoices?.map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                identifier={invoice.id}
                invoice={invoice.data().invoice}
              />
            ))}
          {filterDraft &&
            filterPaid &&
            !filterPending &&
            paidAndDraftInvoices?.map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                identifier={invoice.id}
                invoice={invoice.data().invoice}
              />
            ))}
          {filterDraft &&
            !filterPaid &&
            filterPending &&
            pendingAndDraftInvoices?.map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                identifier={invoice.id}
                invoice={invoice.data().invoice}
              />
            ))}
          {!filterDraft &&
            filterPaid &&
            filterPending &&
            paidAndPendingInvoices?.map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                identifier={invoice.id}
                invoice={invoice.data().invoice}
              />
            ))}
          {filterDraft &&
            filterPaid &&
            filterPending &&
            invoices?.map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                identifier={invoice.id}
                invoice={invoice.data().invoice}
              />
            ))}
        </section>
      </main>
    </>
  )
}

export default Invoices
