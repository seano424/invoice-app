import Head from 'next/head'
import Header from '../components/Header'
import Invoices from '../components/Invoices'

export default function Home() {
  return (
    <div>
      {/* Header */}
      <Header />
      {/* Invoices */}
      <Invoices />
    </div>
  )
}
