import { useController } from 'react-hook-form'

export default function Input({
  control,
  name,
  className,
  total,
  type = 'text',
  onInput,
  defaultValue,
  placeholder,
}) {
  const {
    field: { ref, ...inputProps },
    fieldState: { invalid, isTouched, isDirty },
    formState: { touchedFields, dirtyFields },
  } = useController({
    name,
    control,
    rules: { required: false },
    defaultValue,
  })

  return (
    <input
      min="0"
      defaultValue={defaultValue}
      disabled={total}
      onInput={onInput}
      placeholder={placeholder ? placeholder : defaultValue}
      type={type}
      className={`input ${className}`}
      {...inputProps}
      ref={ref}
    />
  )
}
