import { useState } from 'react'

const statusValues = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED']

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const [status, setStatus] = useState(task.status)
  const [savingStatus, setSavingStatus] = useState(false)

  async function handleStatusSave() {
    if (status === task.status) return
    setSavingStatus(true)
    try {
      await onStatusChange(task.id, status)
    } finally {
      setSavingStatus(false)
    }
  }

  const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString() : '—'
  const fmtDateTime = (iso) => iso ? new Date(iso).toLocaleString() : '—'

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '6px',
        padding: '1rem',
        marginBottom: '1rem',
        background: '#fafafa',
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: '0.4rem' }}>{task.title}</h3>
      {task.description && <p style={{ margin: '0 0 0.4rem' }}>{task.description}</p>}

      <div style={{ fontSize: '0.9rem', color: '#444', marginBottom: '0.6rem' }}>
        <strong>Est. Hours:</strong> {task.estimatedHours ?? '—'} &nbsp;|&nbsp;
        <strong>Priority:</strong> {task.priority} &nbsp;|&nbsp;
        <strong>Status:</strong> {task.status} &nbsp;|&nbsp;
        <strong>Due:</strong> {fmtDate(task.dueDate)} &nbsp;|&nbsp;
        <strong>Completed:</strong> {fmtDateTime(task.completedAt)} &nbsp;|&nbsp;
        <strong>Created:</strong> {fmtDateTime(task.createdAt)}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          Change Status:
          <select value={status} onChange={e => setStatus(e.target.value)} style={{ padding: '0.2rem' }}>
            {statusValues.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>

        <button
          onClick={handleStatusSave}
          disabled={savingStatus || status === task.status}
          style={{ padding: '0.35rem 0.7rem' }}
        >
          {savingStatus ? 'Saving…' : 'Update Status'}
        </button>

        <button onClick={() => onEdit(task)} style={{ marginLeft: 'auto', padding: '0.35rem 0.7rem' }}>
          Edit
        </button>

        <button
          onClick={() => onDelete(task.id)}
          style={{
            marginLeft: '0.5rem',
            padding: '0.35rem 0.7rem',
            background: '#c00',
            color: '#fff',
            border: 'none',
            borderRadius: '3px',
          }}
        >
          Delete
        </button>
      </div>
    </div>
  )
}