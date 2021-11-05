import { atom } from 'recoil'
import NewInvoice from '../components/InvoiceForm'

export const modalState = atom({
  key: 'modalState',
  default: false,
})

export const destroyModalState = atom({
  key: 'destroyModalState',
  default: false,
})

export const pageState = atom({
  key: 'pageState',
  default: <NewInvoice />,
})
