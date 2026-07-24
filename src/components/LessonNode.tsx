import { useNavigate } from 'react-router-dom'

export type NodeState = 'locked' | 'current' | 'completed'
export type NodeKind = 'lesson' | 'review'

interface PathNodeProps {
  to: string
  kind: NodeKind
  state: NodeState
  stars: number
  color: string
  colorDark: string
  offsetX: number
  label: string
}

const ICONS: Record<NodeKind, Record<NodeState, string>> = {
  lesson: { locked: '🔒', current: '★', completed: '✓' },
  review: { locked: '🔒', current: '🔁', completed: '🔁' },
}

export function LessonNode({ to, kind, state, stars, color, colorDark, offsetX, label }: PathNodeProps) {
  const navigate = useNavigate()
  const disabled = state === 'locked'
  const size = kind === 'review' ? 56 : 68

  return (
    <div className="flex justify-center overflow-x-hidden" style={{ transform: `translateX(${offsetX}px)` }}>
      <div className="flex flex-col items-center gap-1">
        {state === 'completed' && kind === 'lesson' && (
          <div className="flex gap-0.5 text-sm" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span key={i} className={i < stars ? 'text-duo-yellow' : 'text-gray-300 dark:text-gray-700'}>
                ★
              </span>
            ))}
          </div>
        )}
        <button
          disabled={disabled}
          onClick={() => navigate(to)}
          className="btn-3d flex items-center justify-center rounded-full border-4 border-white text-2xl text-white disabled:cursor-not-allowed dark:border-[#131f24]"
          style={{
            width: size,
            height: size,
            background: disabled ? '#b5b5b5' : color,
            ['--btn-shadow' as any]: disabled ? '#8f8f8f' : colorDark,
          }}
          aria-label={label}
        >
          {ICONS[kind][state]}
        </button>
      </div>
    </div>
  )
}
