import styles from '@/styles/Button.module.css'

function Button({ bgColor, textColor, text }) {
  return (
    <button className={`${bgColor} ${textColor} ${styles.button}`}>
      {text}
    </button>
  )
}
export default Button
