export default function AiResult({ title, content }) {
  if (!content) return null
  return (
    <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px', background: '#fafafa' }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{content}</pre>
    </div>
  )
}