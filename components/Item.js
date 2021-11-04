import { useState, useEffect } from 'react'
import Label from './Label'
import { TrashIcon } from '@heroicons/react/solid'

function Item({ register, idx, removeItem, item }) {
  const [price, setPrice] = useState(item.price)
  const [quantity, setQuantity] = useState(item.quantity)
  const [total, setTotal] = useState(item.total)
  const [name, setName] = useState(item.name)

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })
  // formatter.format(price * quantity)

  useEffect(() => {
    item && setPrice(item.price)
  }, [])

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value)
    setTotal(e.target.value * price)
  }

  const handlePriceChange = (e) => {
    setPrice(e.target.value)
    setTotal(e.target.value * quantity)
  }

  return (
    <div>
      <Label>Item Name</Label>
      <input
        defaultValue={name}
        {...register(`items.${idx}.name`)}
        className="input"
        name={`items.${idx}.name`}
      />
      <div className="flex items-center space-x-3">
        <div>
          <Label>Qty</Label>
          <input
            min={0}
            defaultValue={quantity}
            {...register(`items.${idx}.quantity`)}
            className="input"
            type="number"
            name={`items.${idx}.quantity`}
            onInput={(e) => handleQuantityChange(e)}
          />
        </div>
        <div>
          <Label>Price</Label>
          <input
            min={0}
            onInput={(e) => handlePriceChange(e)}
            defaultValue={price}
            {...register(`items.${idx}.price`)}
            className="input"
            type="number"
            name={`items.${idx}.price`}
          />
        </div>
        <div>
          <Label>Total</Label>
          <input
            disabled
            // value={total}
            placeholder={formatter.format(total)}
            {...register(`items.${idx}.total`)}
            className="input border-none text-gray-400"
            type="number"
            name={`items.${idx}.total`}
          />
        </div>
        <TrashIcon
          onClick={() => removeItem(idx)}
          className="h-10 w-10 pt-5 cursor-pointer transition hover:scale-110 hover:text-red-400"
        />
      </div>
    </div>
  )
}

export default Item
