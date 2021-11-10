import styles from '@/styles/Modal.module.css'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { destroyModalState, modalState } from '../atoms/modalAtom'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { doc, deleteDoc } from '@firebase/firestore'
import { db } from '../firebase'

export default function DeleteModal({ invoice, id }) {
  const [openDestroy, setOpenDestroy] = useRecoilState(destroyModalState)
  const setOpen = useSetRecoilState(modalState)

  function closeModal() {
    setOpenDestroy(false)
  }

  const destroyInvoice = async () => {
    const deletedDoc = await deleteDoc(doc(db, 'invoices', id))
    console.log('Deleted doc', deletedDoc)
    setOpenDestroy(false)
    setOpen(false)
  }

  return (
    <>
      <Transition appear show={openDestroy} as={Fragment}>
        <Dialog as="div" className={styles.dialog} onClose={closeModal}>
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className={styles.overlay} />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className={styles.body}>
                <Dialog.Title
                  as="h3"
                  className="text-lg font-semibold leading-6 text-gray-900 tracking-wide "
                >
                  Confirm Deletion
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete invoice #
                    <span>{invoice.id}</span>? This action cannot be undone.
                  </p>
                </div>

                <div className="mt-4 flex space-x-4 justify-end">
                  <button
                    type="button"
                    className={styles.cancel}
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={styles.delete}
                    onClick={destroyInvoice}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
