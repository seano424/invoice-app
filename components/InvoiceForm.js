import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { nanoid } from 'nanoid'
import { useSession } from 'next-auth/react'
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc,
} from '@firebase/firestore'
import { db } from '../firebase'
import Button from './Button'
import Label from './Label'
import { useSetRecoilState } from 'recoil'
import { modalState } from '../atoms/modalAtom'
import { paidState, pendingState, draftState } from '../atoms/filterAtom'
import Item from './Item'

function InvoiceForm({ header, invoice, type, identifier }) {
  const [loadingInvoice, setLoadingInvoice] = useState(false)
  const [totalItems, setTotalItems] = useState([])
  const { data: session } = useSession()
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm()
  const setOpen = useSetRecoilState(modalState)
  const setPaid = useSetRecoilState(paidState)
  const setPending = useSetRecoilState(pendingState)
  const setDraft = useSetRecoilState(draftState)
  const toEdit = type === 'edit'
  useEffect(() => {
    invoice && setTotalItems(invoice.items)
  }, [])

  const addItems = (e) => {
    e.preventDefault()
    setTotalItems([
      ...totalItems,
      { name: '', price: '', quantity: '', total: '' },
    ])
  }

  const removeItem = (idx) => {
    console.log(idx)
    const newItems = totalItems.filter((_, index) => index !== idx)
    console.log(newItems)
  }

  const addInvoice = async (data, status) => {
    if (loadingInvoice) return
    setLoadingInvoice(true)

    const updatedItems = data.items?.map((item) => ({
      ...item,
      total: item.price * item.quantity,
    }))

    const totals = data.items?.map((i) => +i.price * +i.quantity)
    const total = totals?.reduce((a, b) => a + b, 0)
    const createdAt = data.createdAt
    const invoiceData = {
      ...data,
      createdAt,
      total: total ? total : 0,
      paymentDue: paymentDue(createdAt, data.paymentTerms),
      status,
      items: updatedItems || [],
      id: nanoid(6).toUpperCase(),
    }
    const docRef = await addDoc(collection(db, 'invoices'), {
      username: session ? session.user.username : 'test user',
      uid: session ? session.user.uid : '123456',
      invoice: invoiceData,
      timestamp: serverTimestamp(),
    })
    console.log('new doc added with ID', docRef.id)
    setLoadingInvoice(false)
    setOpen(false)
  }

  const updateInvoice = async (data, status, invoice) => {
    if (loadingInvoice) return
    setLoadingInvoice(true)

    const invoiceRef = doc(db, 'invoices', identifier)

    const updatedItems = data.items?.map((item) => ({
      ...item,
      total: item.price * item.quantity,
    }))

    const totals = data.items?.map((i) => +i.price * +i.quantity)
    const total = totals?.reduce((a, b) => a + b, 0)
    const createdAt = invoice?.createdAt ? invoice.createdAt : data.createdAt
    const invoiceData = {
      ...data,
      createdAt,
      total: total ? total : 0,
      paymentDue: paymentDue(createdAt, data.paymentTerms),
      status,
      items: updatedItems || [],
      id: invoice?.id ? invoice.id : nanoid(6).toUpperCase(),
    }

    const docRef = await updateDoc(invoiceRef, {
      invoice: invoiceData,
    })

    console.log('new doc updated', docRef)
    setLoadingInvoice(false)
    setOpen(false)
    setPaid(false)
    setPending(false)
    setDraft(false)
  }

  const onSubmit = async (data, status, invoice) => {
    toEdit && (await updateInvoice(data, status, invoice))
    !toEdit && (await addInvoice(data, status))
  }

  const paymentDue = (createdAt, paymentTerms) => {
    const dateArray = createdAt.split('-')
    const dateString = dateArray.join(',')
    const date = new Date(dateString)

    const addedDate = new Date(
      date.getTime() + +paymentTerms * 24 * 60 * 60 * 1000
    )

    const month = addedDate.getUTCMonth() + 1 //months from 1-12
    const day = addedDate.getUTCDate()
    const year = addedDate.getUTCFullYear()

    return year + '-' + month + '-' + day
  }

  return (
    <>
      <main className="p-6 mb-10">
        <h3 className="text-2xl font-semibold leading-6 text-gray-900 dark:text-white flex flex-col mb-6 overflow-y-auto">
          {header}
        </h3>
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          {/* SENDER DETAILS */}
          <section className="flex flex-col mb-4">
            <p className="text-primary mb-4 font-medium">Bill From</p>
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
            <div className="grid grid-cols-3 gap-2">
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
              <div>
                <Label>Country</Label>
                <input
                  defaultValue={
                    invoice ? invoice.senderAddress.country : 'Mexico'
                  }
                  className="input"
                  {...register('senderAddress.country')}
                />
              </div>
            </div>
          </section>

          {/* CLIENT DETAILS */}
          <section className="flex flex-col mb-4">
            <p className="text-primary mb-4 font-medium">Bill To</p>
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
            <div className="grid grid-cols-3 gap-2">
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
              <div>
                <Label>Country</Label>
                <input
                  defaultValue={invoice ? invoice.clientAddress.country : 'USA'}
                  className="input"
                  {...register('clientAddress.country')}
                />
              </div>
            </div>
          </section>

          {/* INVOICE TERMS */}
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

          {/* ITEMS LIST */}
          <section className="my-8">
            <h3 className="text-gray-400 text-xl font-semibold tracking-wide mb-4">
              Item List
            </h3>
            {totalItems.map((item, idx) => (
              <Item
                item={item}
                key={idx}
                register={register}
                idx={idx}
                removeItem={removeItem}
              />
            ))}
            <button
              onClick={addItems}
              className="bg-purple-50 text-secondary hover:text-primary dark:bg-dark dark:text-gray-400 dark:hover:text-white w-full p-2 rounded-full font-semibold transition"
            >
              + Add New Item
            </button>
          </section>
        </form>
      </main>

      {/* FOOTER WITH BUTTONS */}
      <footer className="flex items-center justify-center w-full h-24 bg-white dark:bg-dark gap-3 sticky bottom-[4.5rem] xl:bottom-0">
        {toEdit ? (
          <>
            <div onClick={() => setOpen(false)}>
              <Button
                text="Cancel"
                textColor="text-primary"
                bgColor="bg-gray-50 dark:bg-dark2 dark:text-gray-200"
              />
            </div>
            <div
              onClick={handleSubmit((data) =>
                onSubmit(data, 'pending', invoice)
              )}
            >
              <Button
                text="Save Changes"
                textColor="text-white"
                bgColor="bg-primary"
              />
            </div>
          </>
        ) : (
          <>
            <div onClick={() => setOpen(false)}>
              <Button
                text="Discard"
                textColor="text-gray-500"
                bgColor="bg-gray-50"
              />
            </div>
            <div onClick={handleSubmit((data) => onSubmit(data, 'draft'))}>
              <Button
                text="Save as Draft"
                textColor="text-gray-400"
                bgColor="bg-gray-800"
              />
            </div>
            <div onClick={handleSubmit((data) => onSubmit(data, 'pending'))}>
              <Button
                text="Save & Send"
                textColor="text-white"
                bgColor="bg-primary"
              />
            </div>
          </>
        )}
      </footer>
    </>
  )
}

export default InvoiceForm
