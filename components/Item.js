import { useForm, useController, Controller } from 'react-hook-form'
import Label from './Label'
import { TrashIcon } from '@heroicons/react/solid'
import { useState } from 'react'

function Item() {
  const { type = 'text', label } = props
  const { register, control } = useForm()
  const { field, meta } = useController(props)

  const [price, setPrice] = useState(0)
  const [value, setValue] = useState('')
  const [qty, setQty] = useState(0)
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })
  const total = formatter.format(price * qty)

  return (
    <div>
      <Label>Item Name</Label>

      <div className="flex items-center space-x-4">
        <div>
          <Label>Qty</Label>
          <input
            type="number"
            onInput={(e) => setQty(e.target.value)}
            className="input"
            {...register('quantity')}
          />
        </div>
        <div>
          <Label>Price</Label>
          <input
            type="number"
            onInput={(e) => setPrice(e.target.value)}
            className="input"
            {...register('price')}
          />
        </div>
        <div>
          <Label>Total</Label>
          <input
            type="text"
            className="input border-none text-gray-400"
            disabled
            value={total}
          />
        </div>
        <div>
          <TrashIcon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}

export default Item
