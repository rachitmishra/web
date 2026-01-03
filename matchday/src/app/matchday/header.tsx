import styles from './header.module.css'
import { typography, space } from '@/src/design'
export const Header = () => {
    return (
        <div className={styles.container}>
            <div className={space._16} />
            <p className={typography.title}>MatchDay#1</p>
        </div>
    )
}
