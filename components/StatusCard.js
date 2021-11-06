function StatusCard({ status }) {
  const pending = status === 'pending'
  const paid = status === 'paid'
  const draft = status === 'draft'
  return (
    <div
      className={`flex items-center justify-center space-x-4 w-32 ${
        paid && 'bg-green-50'
      } ${pending && 'bg-yellow-50'} ${
        draft && 'bg-gray-50'
      } bg-opacity-90 rounded-lg px-4 py-2 dark:bg-dark2`}
    >
      <div
        className={`${paid && 'bg-green-400'} ${
          pending && 'bg-yellow-400'
        } w-3 h-3 rounded-full ${draft && 'bg-gray-300'}`}
      />
      <p
        className={`${paid && `text-green-400`} ${
          pending && 'text-yellow-400'
        } font-bold `}
      >
        {status}
      </p>
    </div>
  )
}

export default StatusCard
