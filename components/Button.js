function Button({ bgColor, textColor, text }) {
  return (
    <button
      className={`${bgColor} ${textColor} px-6 py-3 rounded-full font-bold h-14 flex items-center`}
    >
      {text}
    </button>
  )
}

export default Button
