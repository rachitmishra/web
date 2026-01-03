import styles from './scorecard-mini.module.css'
import { components, typography } from '@/src/design'

export const ScoreCardMini = () => {
    return (
        <div>
            <div className={styles.container}>
                <div className={styles.containerBatting}>
                    <span className={styles.teamName}>AlokXI</span>
                    <Batting />
                </div>
                <div className={styles.over}>
                    {Array(6)
                        .fill(0)
                        .map((value, index) => (
                            <Bowl key={index} run={index} />
                        ))}
                </div>
                <div className={styles.containerBowling}>
                    <span className={styles.teamName}>PandeyXI</span>
                    <Bowling />
                </div>
            </div>
            <div className={styles.scoreFooter}>
                <div className={components.separator} />
                <div className={styles.scoreSummary}>
                    <div className={styles.scoreContainer}>
                        {/* <div className={styles.team}>AlokXI</div> */}
                        <span className={styles.score}>11/2</span>
                        <span className={styles.overs}>1/8 overs</span>
                    </div>
                    <div className={styles.scoreInfo}>
                        <div className={styles.runRate}>
                            AlokXI choose to bat
                        </div>
                        <div className={styles.runRate}>8.00 CRR</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Batting = () => {
    const styleCls = [styles.strikeIcon, 'material-symbols-outlined'].join(' ')
    return (
        <div>
            <div className={styles.strike}>
                <span className={styles.batsman}>Alok</span>
                <span className={styles.batsmanScore}>10(30)</span>
                <span className={styleCls}>sports_cricket</span>
            </div>
            <div className={styles.batsmanNonStrike}>
                <span className={styles.batsman}>Chaitanya</span>
                <span className={styles.batsmanScore}>9(2)</span>
            </div>
        </div>
    )
}

const Bowling = () => {
    return (
        <div>
            <div className={styles.bowler}>Sandeep</div>
            <div className={styles.bowlerOver}>0-6(1.2)</div>
        </div>
    )
}

const Bowl = ({ run }: { run?: string }) => {
    return <div className={styles.bowl}>{run ? run : '0'}</div>
}
