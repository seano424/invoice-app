import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { nanoid } from 'nanoid'
import { useSession } from 'next-auth/react'
import { addDoc, collection, serverTimestamp } from '@firebase/firestore'
import { db } from '../firebase'
import Button from './Button'
import Label from './Label'
import MultipleInputs from './MultipleInputs'
import { useRecoilState } from 'recoil'
import { modalState } from '../atoms/modalAtom'

function InvoiceForm({ header, invoice }) {
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
  const [open, setOpen] = useRecoilState(modalState)

  useEffect(() => {
    invoice && setTotalItems(invoice.items)
  }, [])

  const addItems = (e) => {
    e.preventDefault()
    setTrial([...trial, null])
    setTotalItems([...totalItems, totalItems[totalItems.length - 1] + 1])
  }

  const removeItem = (idx) => {
    const filteredItems = totalItems.filter((_, index) => index !== idx)
    totalItems.length > 1 && setTotalItems(filteredItems)
  }

  const uploadPost = async (data, status) => {
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
      status,
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
    setOpen(false)
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

  console.log('totalitems:', totalItems)

  return (
    <>
      <main>
        <h3 className="text-2xl font-semibold leading-6 text-gray-900 flex flex-col mb-6">
          {header}
        </h3>
        <form className="flex flex-col" onSubmit={handleSubmit(uploadPost)}>
          <section className="flex flex-col mb-4">
            <p className="text-purple-500 font-bold mb-4">Bill From</p>
            <Label className="text-gray-400">Street Address</Label>
            <input
              defaultValue={
                invoice ? invoice.senderAddress.street : '19 Union Terrace'
              }
              className="input"
              {...register('senderAddress.street', {
                required: false,
              })}
            />
            {errors.senderStreetAddress?.type === 'required' &&
              'Street address is required'}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>City</Label>
                <input
                  defaultValue={invoice ? invoice.senderAddress.city : 'Oaxaca'}
                  className="input"
                  {...register('senderAddress.city')}
                />
              </div>
              <div>
                <Label>Post Code</Label>
                <input
                  defaultValue={
                    invoice ? invoice.senderAddress.postCode : '66708'
                  }
                  className="input"
                  {...register('senderAddress.postCode')}
                />
              </div>
            </div>
            <Label>Country</Label>
            <input
              defaultValue={invoice ? invoice.senderAddress.country : 'Mexico'}
              className="input"
              {...register('senderAddress.country')}
            />
          </section>

          <section className="flex flex-col mb-4">
            <p className="text-purple-500 font-bold mb-4">Bill To</p>
            <Label className="text-gray-400">Client's Name</Label>
            <input
              defaultValue={invoice ? invoice.clientName : "Sean O'Reilly"}
              className="input"
              {...register('clientName', { required: false })}
            />
            <Label className="text-gray-400">Client's Email</Label>
            <input
              defaultValue={
                invoice ? invoice.clientEmail : 'soreilly424@gmail.com'
              }
              className="input"
              {...register('clientEmail', { required: false })}
            />
            <Label className="text-gray-400">Street Address</Label>
            <input
              defaultValue={
                invoice ? invoice.clientAddress.street : '46 Abbey Row'
              }
              className="input"
              {...register('clientAddress.street', {
                required: false,
              })}
            />
            {errors.clientStreetAddress?.type === 'required' &&
              'Street address is required'}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>City</Label>
                <input
                  defaultValue={
                    invoice ? invoice.clientAddress.city : 'Kansas City'
                  }
                  className="input"
                  {...register('clientAddress.city')}
                />
              </div>
              <div>
                <Label>Post Code</Label>
                <input
                  defaultValue={
                    invoice ? invoice.clientAddress.postCode : '66030'
                  }
                  className="input"
                  {...register('clientAddress.postCode')}
                />
              </div>
            </div>
            <Label>Country</Label>
            <input
              defaultValue={invoice ? invoice.clientAddress.country : 'USA'}
              className="input"
              {...register('clientAddress.country')}
            />
          </section>

          <section className="flex flex-col">
            <Label>Invoice Date</Label>
            <input
              defaultValue={invoice ? invoice.createdAt : '1989-10-07'}
              type="date"
              className="input"
              {...register('createdAt')}
            />
            <Label>Payment Terms</Label>

            <select
              defaultValue={invoice ? invoice.paymentTerms : '19 Union Terrace'}
              className="input"
              {...register('paymentTerms')}
            >
              <option value="15">Net 15 days</option>
              <option value="30">Net 30 days</option>
              <option value="60">Net 60 days</option>
            </select>
            <Label>Project Description</Label>
            <input
              defaultValue={invoice ? invoice.description : 'Graphic Design'}
              className="input "
              {...register('description')}
            />
          </section>

          <section className="my-8">
            <h3 className="text-gray-400 text-xl font-semibold tracking-wide mb-4">
              Item List
            </h3>
            {totalItems.map((i, idx) => (
              <MultipleInputs
                key={idx}
                idx={idx}
                control={control}
                removeItem={() => removeItem(idx)}
                item={i}
                name={i.name}
                price={i.price}
                total={i.total}
                quantity={i.quantity}
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
        <div onClick={() => setOpen(false)}>
          <Button
            text="Discard"
            textColor="text-gray-500"
            bgColor="bg-gray-50"
          />
        </div>
        <div onClick={handleSubmit((data) => uploadPost(data, 'draft'))}>
          <Button
            text="Save as Draft"
            textColor="text-gray-400"
            bgColor="bg-gray-800"
          />
        </div>
        <div onClick={handleSubmit((data) => uploadPost(data, 'pending'))}>
          <Button
            text="Save & Send"
            textColor="text-white"
            bgColor="bg-purple-500"
          />
        </div>
      </footer>
    </>
  )
}

export default InvoiceForm
