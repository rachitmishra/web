import BarChart from '@/src/design/components/chart-bar'
import styles from './overs.module.css'

export const Overs = () => {
    const data = [10, 15, 20, 25, 30]
    const labels = ['2', '4', '6', '8', '10']
    const options = {
        barColor: 'orange',
        axisColor: 'black',
    }
    return (
        <div className={styles.container}>
            <div className={styles.overs}>8.3 overs</div>
            <BarChart data={data} options={options} labels={labels} />
        </div>
    )
}
