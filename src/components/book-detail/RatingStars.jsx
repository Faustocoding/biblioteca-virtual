export function RatingStars({ value, onChange, readOnly = false, size = 'text-2xl' }) {
  const stars = [1, 2, 3, 4, 5]

  return (
    <div className={`flex gap-0.5 ${size}`}>
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star === value ? null : star)}
          className={`leading-none transition ${readOnly ? 'cursor-default' : 'cursor-pointer'} ${
            value >= star ? 'text-amber-400' : 'text-zinc-300 dark:text-zinc-700'
          }`}
          aria-label={`${star} estrellas`}
        >
          ★
        </button>
      ))}
    </div>
  )
}
