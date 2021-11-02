import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { nanoid } from 'nanoid'
import { useSession } from 'next-auth/react'
import { addDoc, collection, serverTimestamp } from '@firebase/firestore'
import { db } from '../firebase'
import Header from '../components/Header'
import Button from '../components/Button'
import Label from '../components/Label'
import MultipleInputs from '../components/MultipleInputs'
import { stringify } from '@firebase/util'

function NewInvoice() {
  const [loadingInvoice, setLoadingInvoice] = useState(false)
  const [totalItems, setTotalItems] = useState([1])
  const [trial, setTrial] = useState([null])
  const { data: session } = useSession()
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm()

  const addItems = (e) => {
    e.preventDefault()
    setTrial([...trial, null])
    setTotalItems([...totalItems, totalItems[totalItems.length - 1] + 1])
  }

  const removeItem = (idx) => {
    const filteredItems = totalItems.filter((_, index) => index !== idx)
    totalItems.length > 1 && setTotalItems(filteredItems)
  }

  const uploadPost = async (data) => {
    if (loadingInvoice) return
    setLoadingInvoice(true)

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    })

    const updatedItems = data.items.map((item) => ({
      ...item,
      total: formatter.format(item.price * item.qty),
    }))

    const totals = data.items.map((i) => i.price * i.qty)
    const total = totals.reduce((a, b) => a + b, 0)

    const invoiceData = {
      ...data,
      total: formatter.format(total),
      paymentDue: paymentDue(data.createdAt, data.paymentTerms),
      status: 'pending',
      items: updatedItems,
      id: nanoid(6).toUpperCase(),
    }
    // 1. Create an invoice and add to firestore 'invoices' collection
    // 2. Get the invoice ID for the newly created invoice
    const docRef = await addDoc(collection(db, 'invoices'), {
      username: session.user.username,
      uid: session.user.uid,
      invoice: invoiceData,
      timestamp: serverTimestamp(),
    })
    console.log(invoiceData)
    console.log('new doc added with ID', docRef.id)
    setLoadingInvoice(false)
  }

  const onSubmit = async (data) => {
    await uploadPost(data)
  }

  const paymentDue = (createdAt, paymentTerms) => {
    const dateArray = createdAt.split('-')
    const dateString = dateArray.join(',')
    const date = new Date(dateString)
    console.log(date)

    const addedDate = new Date(
      date.getTime() + +paymentTerms * 24 * 60 * 60 * 1000
    )

    const month = addedDate.getUTCMonth() + 1 //months from 1-12
    const day = addedDate.getUTCDate()
    const year = addedDate.getUTCFullYear()

    return year + '-' + month + '-' + day
  }

  return (
    <div>
      <Header />
      <main className="max-w-sm sm:max-w-xl xl:max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold my-4">
          Edit <span className="text-gray-400">#</span>
          someidnumber
        </h1>

        <form className="flex flex-col " onSubmit={handleSubmit(onSubmit)}>
          <section className="flex flex-col mb-4">
            <p className="text-purple-500 font-bold mb-4">Bill From</p>
            <Label className="text-gray-400">Street Address</Label>
            <input
              className="input"
              {...register('senderAddress.senderStreetAddress', {
                required: false,
              })}
            />
            {errors.senderStreetAddress?.type === 'required' &&
              'Street address is required'}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>City</Label>
                <input
                  className="input"
                  {...register('senderAddress.senderCity')}
                />
              </div>
              <div>
                <Label>Post Code</Label>
                <input
                  className="input"
                  {...register('senderAddress.senderPostCode')}
                />
              </div>
            </div>
            <Label>Country</Label>
            <input
              className="input"
              {...register('senderAddress.senderCountry')}
            />
          </section>

          <section className="flex flex-col mb-4">
            <p className="text-purple-500 font-bold mb-4">Bill To</p>
            <Label className="text-gray-400">Client's Name</Label>
            <input
              className="input"
              {...register('clientName', { required: false })}
            />
            <Label className="text-gray-400">Client's Email</Label>
            <input
              className="input"
              {...register('clientEmail', { required: false })}
            />
            <Label className="text-gray-400">Street Address</Label>
            <input
              className="input"
              {...register('clientAddress.clientStreetAddress', {
                required: false,
              })}
            />
            {errors.clientStreetAddress?.type === 'required' &&
              'Street address is required'}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>City</Label>
                <input
                  className="input"
                  {...register('clientAddress.clientCity')}
                />
              </div>
              <div>
                <Label>Post Code</Label>
                <input
                  className="input"
                  {...register('clientAddress.clientPostCode')}
                />
              </div>
            </div>
            <Label>Country</Label>
            <input
              className="input"
              {...register('clientAddress.clientCountry')}
            />
          </section>

          <section className="flex flex-col">
            <Label>Invoice Date</Label>
            <input type="date" className="input" {...register('createdAt')} />
            <Label>Payment Terms</Label>

            <select className="input" {...register('paymentTerms')}>
              <option value="15">Net 15 days</option>
              <option value="30">Net 30 days</option>
              <option value="60">Net 60 days</option>
            </select>
            <Label>Project Description</Label>
            <input className="input " {...register('description')} />
          </section>

          <section className="my-8">
            <h3 className="text-gray-400 text-xl font-semibold tracking-wide mb-4">
              Item List
            </h3>
            {totalItems.map((_, index) => (
              <MultipleInputs
                removeItem={() => removeItem(index)}
                key={index}
                control={control}
                idx={index}
              />
            ))}
            <button
              onClick={(e) => addItems(e)}
              className="bg-purple-50 text-purple-400 w-full p-2 rounded font-semibold transition hover:text-purple-500"
            >
              + Add New Item
            </button>
          </section>
        </form>
      </main>
      <footer className="flex items-center justify-center w-full h-24 bg-white gap-3">
        <Button text="Discard" textColor="text-gray-500" bgColor="bg-gray-50" />
        <Button
          text="Save as Draft"
          textColor="text-gray-400"
          bgColor="bg-gray-800"
        />
        <div onClick={handleSubmit(onSubmit)}>
          <Button
            text="Save & Send"
            textColor="text-white"
            bgColor="bg-purple-500"
          />
        </div>
      </footer>
    </div>
  )
}

export default NewInvoice
