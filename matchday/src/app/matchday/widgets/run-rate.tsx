'use client'
import styles from './run-rate.module.css'
import BarChart from '@/src/design/components/chart-bar'

export const RunRate = () => {
    const data = [10, 4, 8, 1, 15]
    const labels = ['1', '2', '3', '4', '5']

    const options = {
        barColor: 'orange',
        axisColor: 'black',
    }
    return (
        <div className={styles.container}>
            <div className={styles.runRate}>8.00 CRR</div>
            <BarChart data={data} options={options} labels={labels} />
        </div>
    )
}
