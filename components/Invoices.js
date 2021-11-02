import { collection, onSnapshot, orderBy, query } from '@firebase/firestore'

import { ChevronDownIcon, PlusIcon } from '@heroicons/react/solid'
import { useRouter } from 'next/dist/client/router'
import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
// import invoices from '../data.json'
import Invoice from './Invoice'
import { db } from '../firebase'

function Invoices() {
  const [invoices, setInvoices] = useState([])
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(
    () =>
      onSnapshot(query(collection(db, 'invoices')), (snapshot) => {
        setInvoices(snapshot.docs)
      }),
    [db]
  )

  return (
    <main className="max-w-2xl md:max-w-6xl mx-auto">
      {/* Top Part */}
      <section className="flex justify-between my-4">
        <div>
          <h4 className="text-xl font-bold">Invoices</h4>
          <p>7 invoices</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <p className="font-bold">Filter </p>
            <ChevronDownIcon className="h-8 w-8 cursor-pointer" />
          </div>
          <div onClick={() => (session ? router.push('/new') : signIn())}>
            <button className="flex space-x-2 items-center bg-purple-500 p-2 rounded-full">
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
          <Invoice key={invoice.id} {...invoice.data().invoice} />
        ))}
      </section>
    </main>
  )
}

export default Invoices
