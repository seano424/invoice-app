import { useState } from 'react'
import Label from './Label'
import Input from './Input'
import { TrashIcon } from '@heroicons/react/solid'

function MultipleInputs({ control, idx, removeItem }) {
  const [price, setPrice] = useState(0)
  const [qty, setQty] = useState(0)
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })
  const total = formatter.format(price * qty)
  return (
    <>
      <Label>Item Name</Label>
      <Input name={`items.${idx}.itemName`} control={control} />
      <div className="flex items-center space-x-3">
        <div>
          <Label>Qty</Label>
          <Input
            onInput={(e) => setQty(e.target.value)}
            type="number"
            name={`items.${idx}.qty`}
            control={control}
          />
        </div>
        <div>
          <Label>Price</Label>
          <Input
            onInput={(e) => setPrice(e.target.value)}
            type="number"
            name={`items.${idx}.price`}
            control={control}
          />
        </div>
        <div>
          <Label>Total</Label>
          <Input
            type="number"
            name={`items.${idx}.total`}
            total={total}
            className="input border-none text-gray-400"
            control={control}
          />
        </div>
        <TrashIcon
          onClick={() => removeItem(idx)}
          className="h-10 w-10 pt-5 cursor-pointer transition hover:scale-110 hover:text-red-400"
        />
      </div>
    </>
  )
}

export default MultipleInputs
