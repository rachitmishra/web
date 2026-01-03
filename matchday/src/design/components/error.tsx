import styles from './error.module.css'

export const Error = ({ message }: { message?: string }) => {
    return <p className={styles.error}>{message}</p>
}
