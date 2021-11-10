import { useState, useRef } from 'react'
import { signIn, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRecoilState, useRecoilValue } from 'recoil'
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/solid'
import InvoiceCard from './InvoiceCard'
import { modalState, pageState } from '../atoms/modalAtom'
import { trialModeState } from '../atoms/trialModeAtom'
import { paidState, pendingState, draftState } from '../atoms/filterAtom'
import Modal from './Modal'
import InvoiceForm from './InvoiceForm'
import useOutsideClick from '../hooks/useOutsideClick'
import { useSelector } from 'react-redux'
import { selectInvoices } from '../redux/features/invoice/invoiceSlice'
import styles from '@/styles/Invoices.module.css'
import {
  paidAndDraftInvoices,
  paidInvoices,
  paidAndPendingInvoices,
  pendingAndDraftInvoices,
  pendingInvoices,
  draftInvoices,
} from '@/lib/helpers'

function Invoices() {
  const invoices = useSelector(selectInvoices)
  const { data: session } = useSession()
  const [_, setOpen] = useRecoilState(modalState)
  const trialMode = useRecoilValue(trialModeState)
  const [page, setPage] = useRecoilState(pageState)
  const [filterPaid, setFilterPaid] = useRecoilState(paidState)
  const [filterPending, setFilterPending] = useRecoilState(pendingState)
  const [filterDraft, setFilterDraft] = useRecoilState(draftState)
  const [showFilter, setShowFilter] = useState(false)
  const filterRef = useRef()

  useOutsideClick(filterRef, () => {
    setShowFilter(false)
  })

  const handleNew = () => {
    setPage(<InvoiceForm type="new" header="New Invoice" />)
    setOpen(true)
  }

  return (
    <>
      <Modal page={page} />
      <main className={styles.main}>
        {/* Top Part */}
        <section className={styles.top}>
          <div>
            <h4>Invoices</h4>
            <p>
              <span> There are </span> {invoices.length} invoices
            </p>
          </div>

          {/* Filter Dropdown */}
          <div className={styles.filter}>
            <div ref={filterRef} className={styles.filterContainer}>
              <div
                onClick={() => setShowFilter(!showFilter)}
                className={styles.filterHeader}
              >
                <p>
                  Filter <span>by status</span>{' '}
                </p>
                <ChevronDownIcon className="h-8 w-8 cursor-pointer" />
              </div>
              {showFilter && (
                <div className={styles.filterCard}>
                  <div>
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
                  <div>
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
                  <div>
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
              <button onClick={handleNew} className={styles.button}>
                <span>
                  <PlusIcon className="dark:text-black" />
                </span>
                <span>New</span>
              </button>
            </div>
          </div>
        </section>

        {/* Individual invoices */}
        <section>
          {!invoices.length && (
            <div className={styles.nothingImg}>
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
                invoice={invoice.invoice}
              />
            ))}
          {filterDraft &&
            !filterPaid &&
            !filterPending &&
            draftInvoices(invoices)?.map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                identifier={invoice.id}
                invoice={invoice.invoice}
              />
            ))}
          {!filterDraft &&
            filterPaid &&
            !filterPending &&
            paidInvoices(invoices)?.map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                identifier={invoice.id}
                invoice={invoice.invoice}
              />
            ))}
          {!filterDraft &&
            !filterPaid &&
            filterPending &&
            pendingInvoices(invoices)?.map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                identifier={invoice.id}
                invoice={invoice.invoice}
              />
            ))}
          {filterDraft &&
            filterPaid &&
            !filterPending &&
            paidAndDraftInvoices(invoices)?.map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                identifier={invoice.id}
                invoice={invoice.invoice}
              />
            ))}
          {filterDraft &&
            !filterPaid &&
            filterPending &&
            pendingAndDraftInvoices(invoices)?.map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                identifier={invoice.id}
                invoice={invoice.invoice}
              />
            ))}
          {!filterDraft &&
            filterPaid &&
            filterPending &&
            paidAndPendingInvoices(invoices)?.map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                identifier={invoice.id}
                invoice={invoice.invoice}
              />
            ))}
          {filterDraft &&
            filterPaid &&
            filterPending &&
            invoices?.map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                identifier={invoice.id}
                invoice={invoice.invoice}
              />
            ))}
        </section>
      </main>
    </>
  )
}

export default Invoices
