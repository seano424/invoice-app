import { configureStore } from '@reduxjs/toolkit'
import invoiceReducer from './features/invoice/invoiceSlice'

export const store = configureStore({
  reducer: {
    invoice: invoiceReducer,
  },
})
