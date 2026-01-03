import styles from './poll.module.css'
import { Pill, space, typography } from '@/src/design'
import { PollProgress } from '../../../components/poll-progress'

type Props = {
    minimised?: boolean
}
export const Poll = ({ minimised = true }: Props) => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <p className={typography.title}>Joining for the game?</p>
                {!minimised && <Pill text="Open" />}
            </div>
            <div className={space._8} />
            <PollProgress checked={true} votes={11} text="Yes, I am in!" />
            <div className={space._4} />
            <PollProgress votes={4} text="No, I am out!" />
        </div>
    )
}
