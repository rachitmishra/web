import styles from './page.module.css'
import { space, components } from '@/src/design'
import { Header } from './header'
import { Details } from './widgets/details'
import { Poll } from './widgets/poll'
import { ScoreCardMini } from './widgets/scorecard-mini'
import { Scorer } from './widgets/scorer'
import { Share } from './widgets/share'
import { Overs } from './widgets/overs'
import { RunRate } from './widgets/run-rate'

const MatchDay = ({ gameStarted = true, isScorer = true }) => {
    return (
        <div className={styles.page}>
            <div className={components.card}>
                <Header />
            </div>
            <div className={styles.container}>
                <div>
                    {!gameStarted && (
                        <>
                            <div className={space._12} />
                            <div className={components.card}>
                                <Details />
                            </div>
                        </>
                    )}
                    {!gameStarted && (
                        <>
                            <div className={space._12} />
                            <div className={components.card}>
                                <Poll />
                            </div>
                        </>
                    )}
                    {gameStarted && (
                        <>
                            <div className={space._12} />
                            <div className={components.card}>
                                <ScoreCardMini />
                            </div>
                        </>
                    )}
                    {gameStarted && (
                        <>
                            <div className={space._12} />
                            <div className={components.row}>
                                <div className={components.card}>
                                    <Overs />
                                </div>
                                <div className={components.card}>
                                    <RunRate />
                                </div>
                            </div>
                        </>
                    )}
                    {isScorer && gameStarted && (
                        <>
                            <div className={space._12} />
                            <div className={components.card}>
                                <Scorer />
                            </div>
                        </>
                    )}
                </div>
                {!gameStarted && <Share />}
            </div>
        </div>
    )
}
export default MatchDay
