export default function AiResult({ title, content }) {
  if (!content) return null
  return (
    <div className="border border-border bg-surface rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">{title}</h3>
      <pre className="whitespace-pre-wrap font-[inherit] text-sm text-text leading-relaxed">{content}</pre>
    </div>
  )
}