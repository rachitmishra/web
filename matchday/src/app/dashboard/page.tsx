import Empty from '@/src/components/empty'
import styles from './page.module.css'
import { space, typography, components } from '@/src/design'
import { Details } from '../matchday/widgets/details'
import { Share } from '../matchday/widgets/share'
import { Poll } from '../matchday/widgets/poll'
import { PreviousMatchDay } from './previous-matchday'
import { Header } from './header'

export default async function AllMatches() {
    const data = await getData()
    if (data.length < 0) {
        return (
            <Empty
                image="https://firebasestorage.googleapis.com/v0/b/matchday-7cca5.appspot.com/o/empty.svg?alt=media&token=83d6aa4e-07aa-4852-a237-0106ef77b8df"
                title="No matchdays"
                buttonTitle="Create"
            />
        )
    }
    return (
        <div className={styles.page}>
            <Header />
            <div className={styles.container}>
                <div className={components.card}>
                    <h2 className={typography.subtitle}>MatchDay#1</h2>
                    <div className={components.separator} />
                    <Details />
                    <div className={components.separator} />
                    <div className={space._8} />
                    <Poll />
                    <div className={space._24} />
                    <Share />
                </div>
                <div>
                    <PreviousMatchDay />
                    <div className={space.s12} />
                </div>
            </div>
        </div>
    )
}

type Match = {}
type Data = {
    matches: Match[]
}
async function getData(): Promise<Data> {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts')
    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }

    return res.json()
}
