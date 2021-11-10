import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  invoices: [],
}

export const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    setInvoices: (state, action) => {
      state.invoices = action.payload
    },
  },
})

export const { setInvoices } = invoiceSlice.actions

export const selectInvoices = (state) => state.invoice.invoices

export default invoiceSlice.reducer
