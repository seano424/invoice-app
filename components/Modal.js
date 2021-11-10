import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { useRecoilState } from 'recoil'
import { modalState } from '../atoms/modalAtom'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import styles from '@/styles/Modal.module.css'

export default function Modal({ header, page }) {
  const [open, setOpen] = useRecoilState(modalState)

  function closeModal() {
    setOpen(false)
  }

  return (
    <div>
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className={styles.mainDialog} onClose={closeModal}>
          <div className="min-h-screen">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-900 opacity-20" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="inline-block h-screen" aria-hidden="true">
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
              <div className={`${styles.mainBody} dark:bg-gray-900 `}>
                <div
                  onClick={closeModal}
                  className="px-4 pt-4 cursor-pointer flex items-center space-x-4"
                >
                  {' '}
                  <ChevronLeftIcon className="h-4 w-4 text-primary" />
                  <h4 className="font-bold text-xs">Go back</h4>
                </div>
                <Dialog.Title as="h3" className={styles.mainHeader}>
                  {header}
                </Dialog.Title>
                <div>{page}</div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}
