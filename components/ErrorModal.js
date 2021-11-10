import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { errorModalState } from '../atoms/modalAtom'
import { useRecoilState } from 'recoil'
import styles from '@/styles/Modal.module.css'

export default function ErrorModal({ invoice, id }) {
  const [openError, setOpenError] = useRecoilState(errorModalState)

  function closeModal() {
    setOpenError(false)
  }

  return (
    <>
      <Transition appear show={openError} as={Fragment}>
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
                  Oops!
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    You must be signed in to complete this form
                  </p>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className={styles.error}
                    onClick={closeModal}
                  >
                    Got it!
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
