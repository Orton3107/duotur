import { useNavigate } from 'react-router-dom'
import type { ModuleId } from '../data/types'

export type NodeState = 'locked' | 'current' | 'completed'

interface LessonNodeProps {
  moduleId: ModuleId
  lessonIndex: number
  state: NodeState
  stars: number
  color: string
  colorDark: string
  offsetX: number
}

export function LessonNode({ moduleId, lessonIndex, state, stars, color, colorDark, offsetX }: LessonNodeProps) {
  const navigate = useNavigate()
  const disabled = state === 'locked'

  return (
    <div className="flex justify-center" style={{ transform: `translateX(${offsetX}px)` }}>
      <div className="flex flex-col items-center gap-1">
        {state === 'completed' && (
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
          onClick={() => navigate(`/lesson/${moduleId}/${lessonIndex}`)}
          className="btn-3d flex h-[68px] w-[68px] items-center justify-center rounded-full border-4 border-white text-3xl text-white disabled:cursor-not-allowed dark:border-[#131f24]"
          style={{
            background: disabled ? '#b5b5b5' : color,
            ['--btn-shadow' as any]: disabled ? '#8f8f8f' : colorDark,
          }}
          aria-label={`Урок ${lessonIndex + 1}`}
        >
          {state === 'locked' && '🔒'}
          {state === 'current' && '★'}
          {state === 'completed' && '✓'}
        </button>
      </div>
    </div>
  )
}
