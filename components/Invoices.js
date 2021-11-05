import { useRecoilState } from 'recoil'
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  getDocs,
  doc,
} from '@firebase/firestore'
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/solid'
import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import InvoiceCard from './InvoiceCard'
import { db } from '../firebase'
import { modalState, pageState } from '../atoms/modalAtom'
import Modal from './Modal'
import InvoiceForm from './InvoiceForm'

function Invoices() {
  const [invoices, setInvoices] = useState([])
  const { data: session } = useSession()
  const [_, setOpen] = useRecoilState(modalState)
  const [page, setPage] = useRecoilState(pageState)

  useEffect(
    () =>
      onSnapshot(query(collection(db, 'invoices')), (snapshot) => {
        setInvoices(snapshot.docs)
      }),
    [db]
  )

  const handleNew = () => {
    setPage(<InvoiceForm type="new" header="New Invoice" />)
    setOpen(true)
  }

  return (
    <>
      <Modal page={page} />
      <main className="max-w-xs md:max-w-3xl mx-auto pt-[4.5rem]">
        {/* Top Part */}
        <section className="flex justify-between my-4">
          <div>
            <h4 className="text-xl font-bold">Invoices</h4>
            <p>
              <span className="hidden sm:inline-block"> There are </span>{' '}
              {invoices.length} invoices
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <p className="font-bold">Filter </p>
              <ChevronDownIcon className="h-8 w-8 cursor-pointer" />
            </div>
            <div onClick={() => !session && signIn()}>
              <button
                onClick={handleNew}
                className="flex space-x-2 items-center bg-primary p-2 rounded-full cursor-pointer"
              >
                <span className="bg-white flex items-center justify-center w-8 h-8 rounded-full">
                  <PlusIcon />
                </span>
                <span className="text-white">New</span>
              </button>
            </div>
          </div>
        </section>

        {/* Individual invoices */}
        <section>
          {invoices?.map((invoice) => (
            // <h1>{invoice.id}</h1>
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
