import styles from './details.module.css'
import { Weather } from '@/src/components/weather'
import { Venue } from '@/src/components/venue'
import { Time } from '@/src/components/time'

export const Details = () => {
    return (
        <div className={styles.container}>
            <div className={styles.containerTime}>
                <Time />
                <Venue />
            </div>
            <Weather />
        </div>
    )
}
