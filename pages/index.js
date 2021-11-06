import Header from '../components/Header'
import Invoices from '../components/Invoices'

export default function Home() {
  return (
    <div className="h-screen w-screen flex">
      {/* Header */}

      <Header />

      {/* Invoices */}

      <Invoices />

      {/* <NewInvoice /> */}
    </div>
  )
}
