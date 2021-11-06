function Button({ bgColor, textColor, text }) {
  return (
    <button
      className={`${bgColor} ${textColor} text-xs md:text-base px-6 py-4 md:px-6 md:py-3 rounded-full font-bold md:h-14 flex items-center`}
    >
      {text}
    </button>
  )
}
export default Button
