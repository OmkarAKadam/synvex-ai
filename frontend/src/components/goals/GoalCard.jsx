import { useState } from 'react'

export default function GoalCard({ goal, onEdit, onDelete, onProgressChange }) {
  const [progress, setProgress] = useState(goal.progressPercentage)
  const [savingProgress, setSavingProgress] = useState(false)

  async function handleProgressSave() {
    setSavingProgress(true)
    try {
      await onProgressChange(goal.id, progress)
    } finally {
      setSavingProgress(false)
    }
  }

  return (
    <div style={{border:'1px solid #ddd', padding:'1rem', marginBottom:'1rem', borderRadius:'4px'}}>
      <h3>{goal.title}</h3>
      <p>{goal.description}</p>
      <div style={{fontSize:'0.9rem', color:'#555', marginBottom:'0.5rem'}}>
        <strong>Deadline:</strong> {goal.deadline} &nbsp;|&nbsp;
        <strong>Priority:</strong> {goal.priority} &nbsp;|&nbsp;
        <strong>Status:</strong> {goal.status} &nbsp;|&nbsp;
        <strong>Risk:</strong> {goal.riskLevel}
      </div>

      <div style={{display:'flex', gap:'0.5rem', alignItems:'center', flexWrap:'wrap'}}>
        <label>
          Progress %:
          <input
            type="range"
            min={0} max={100}
            value={progress}
            onChange={e => setProgress(Number(e.target.value))}
            style={{marginLeft:'0.5rem', width:'120px'}}
          />
          <output style={{marginLeft:'0.5rem'}}>{progress}</output>
        </label>
        <button onClick={handleProgressSave} disabled={savingProgress || progress===goal.progressPercentage}>
          {savingProgress ? 'Saving…' : 'Update Progress'}
        </button>

        <button onClick={() => onEdit(goal)} style={{marginLeft:'auto'}}>Edit</button>
        <button onClick={() => onDelete(goal.id)} style={{background:'#c00', color:'#fff', border:'none', padding:'0.3rem 0.6rem', borderRadius:'3px'}}>Delete</button>
      </div>
    </div>
  )
}