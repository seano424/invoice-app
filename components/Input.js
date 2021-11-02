import { useController } from 'react-hook-form'

export default function Input({
  control,
  name,
  className,
  total,
  type = 'text',
  onInput,
}) {
  const {
    field: { ref, ...inputProps },
    fieldState: { invalid, isTouched, isDirty },
    formState: { touchedFields, dirtyFields },
  } = useController({
    name,
    control,
    rules: { required: false },
    defaultValue: '',
  })

  return (
    <input
      min="0"
      disabled={total}
      onInput={onInput}
      placeholder={total}
      type={type}
      className={`input ${className}`}
      {...inputProps}
      ref={ref}
    />
  )
}
