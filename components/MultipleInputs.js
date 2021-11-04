import { useState, useEffect } from 'react'
import Label from './Label'
import Input from './Input'
import { TrashIcon } from '@heroicons/react/solid'

function MultipleInputs({
  control,
  idx,
  removeItem,
  price,
  name,
  total,
  quantity,
}) {
  const [itemName, setItemName] = useState(name)
  const [itemPrice, setItemPrice] = useState(price)
  const [itemQuantity, setItemQuantity] = useState(quantity)
  const [itemTotal, setItemTotal] = useState(total)
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  useEffect(() => {
    setItemName(name)
    setItemPrice(price)
    setItemQuantity(quantity)
    setItemTotal(total)
  }, [price, quantity])

  const handleChange = (e) => {
    e.target.name === `items.${idx}.quantity` && setItemQuantity(e.target.value)
    e.target.name === `items.${idx}.price` && setItemPrice(e.target.value)
    setItemTotal(formatter.format(itemQuantity * itemPrice))
  }

  console.log('name', itemName)
  console.log('total', itemTotal)
  // setTotal(formatter.format(price * qty))
  return (
    <>
      <Label>Item Name</Label>
      <Input
        onInput={(e) => setItemName(e.target.value)}
        defaultValue={itemName}
        name={`items.${idx}.name`}
        control={control}
      />
      <div className="flex items-center space-x-3">
        <div>
          <Label>Qty</Label>
          <Input
            onInput={(e) => handleChange(e)}
            defaultValue={itemQuantity}
            type="number"
            name={`items.${idx}.quantity`}
            control={control}
          />
        </div>
        <div>
          <Label>Price</Label>
          <Input
            defaultValue={itemPrice}
            onInput={(e) => handleChange(e)}
            type="number"
            name={`items.${idx}.price`}
            control={control}
          />
        </div>
        <div>
          <Label>Total</Label>
          <Input
            type="number"
            placeholder={itemTotal}
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
