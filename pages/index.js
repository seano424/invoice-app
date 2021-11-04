import Head from 'next/head'
import Header from '../components/Header'
import Invoices from '../components/Invoices'
import Modal from '../components/Modal'
import NewInvoice from '../components/InvoiceForm'

export default function Home() {
  return (
    <div>
      {/* Header */}
      <Header />
      {/* Invoices */}
      <Invoices />

      {/* <NewInvoice /> */}
    </div>
  )
}
