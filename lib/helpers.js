export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export const paidInvoices = (invoices) => {
  return invoices.filter((i) => i.invoice.status === 'paid')
}

export const paidAndPendingInvoices = (invoices) => {
  return invoices.filter(
    (i) => i.invoice.status === 'paid' || i.invoice.status === 'pending'
  )
}

export const paidAndDraftInvoices = (invoices) => {
  return invoices.filter(
    (i) => i.invoice.status === 'paid' || i.invoice.status === 'draft'
  )
}

export const pendingInvoices = (invoices) => {
  return invoices.filter((i) => i.invoice.status === 'pending')
}
export const pendingAndDraftInvoices = (invoices) => {
  return invoices.filter(
    (i) => i.invoice.status === 'draft' || i.invoice.status === 'pending'
  )
}

export const draftInvoices = (invoices) => {
  return invoices.filter((i) => i.invoice.status === 'draft')
}
