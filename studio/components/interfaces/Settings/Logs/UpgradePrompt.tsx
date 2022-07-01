import { Button } from '@supabase/ui'
import dayjs from 'dayjs'
import { useProjectSubscription } from 'hooks'
import Link from 'next/link'
import { TIER_QUERY_LIMITS } from '.'
interface Props {
  projectRef: string
  from: string
}

const UpgradePrompt: React.FC<Props> = ({ projectRef, from }) => {
  const sub = useProjectSubscription(projectRef)
  const tier = sub?.subscription?.tier
  const queryLimit = TIER_QUERY_LIMITS[(tier?.key || 'FREE') as keyof typeof TIER_QUERY_LIMITS]

  const fromValue = from ? dayjs(from) : dayjs()
  const fromMax = dayjs().startOf('day').subtract(queryLimit.value, queryLimit.unit)
  const isExceedingLimit = fromValue.isBefore(fromMax)
  
  return (
    <div
      className={`flex flex-row gap-3 items-center text-xs px-2 py-1 transition-all ${
        isExceedingLimit
          ? 'text-yellow-1100  rounded border border-yellow-700 bg-yellow-200 font-semibold'
          : ''
      }`}
    >
      <span>{`${queryLimit.text} retention`}</span>
      {queryLimit.promptUpgrade && (
        <Link href={`/project/${projectRef}/settings/billing`}>
          <Button size="tiny">Upgrade</Button>
        </Link>
      )}
    </div>
  )
}

export default UpgradePrompt
