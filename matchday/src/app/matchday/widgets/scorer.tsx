import { components, space } from '@/src/design'
import styles from './scorer.module.css'

export const Scorer = () => {
    const styleClsFour = [styles.buttonRun, styles.buttonFour].join(' ')
    const styleClsSix = [styles.buttonRun, styles.buttonSix].join(' ')
    return (
        <div className={styles.container}>
            <div className={styles.containerRun}>
                <span className={styles.buttonRun}>0</span>
                <span className={styles.buttonRun}>1</span>
                <span className={styles.buttonRun}>2</span>
                <span className={styles.buttonRun}>3</span>
                <span className={styleClsFour}>4</span>
                <span className={styleClsSix}>6</span>
            </div>
            <div className={space._8} />
            <div className={styles.containerWicket}>
                <span className={styles.buttonWicket}>Caught</span>
                <span className={styles.buttonWicket}>Bowled</span>
                <span className={styles.buttonWicket}>Runout</span>
                <span className={styles.buttonWicket}>Swap</span>
            </div>
            <div className={space._8} />
            <div className={styles.containerExtra}>
                <span className={styles.buttonExtra}>Wide</span>
                <span className={styles.buttonExtra}>No</span>
                <span className={styles.buttonExtra}>Dead</span>
                <span className={styles.buttonExtra}>Bye</span>
                <div className={styles.buttonUndo}>Undo</div>
            </div>
        </div>
    )
}
