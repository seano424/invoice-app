import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { destroyModalState, modalState } from '../atoms/modalAtom'
import { useRecoilState } from 'recoil'
import { doc, deleteDoc } from '@firebase/firestore'
import { useRouter } from 'next/dist/client/router'
import { db } from '../firebase'

export default function DeleteModal({ invoice, id }) {
  const [openDestroy, setOpenDestroy] = useRecoilState(destroyModalState)
  const [open, setOpen] = useRecoilState(modalState)
  const router = useRouter()

  function closeModal() {
    setOpenDestroy(false)
  }

  function openModal() {
    setOpenDestroy(true)
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
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
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
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-40" />
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
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
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
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-50 border border-transparent rounded-3xl hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-3xl hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
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
