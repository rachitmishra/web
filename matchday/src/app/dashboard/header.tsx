import styles from './header.module.css'
import { Pill, space } from '@/src/design'
import { User } from './user'
export const Header = () => {
    return (
        <div className={styles.container}>
            <div className={space._16} />
            <User />
            <Pill text="MatchDays" checked={true} />
            <Pill text="Stats" />
            <div className={space._16} />
        </div>
    )
}
