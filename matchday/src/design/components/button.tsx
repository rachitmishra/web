import styles from './button.module.css'

export const Button = ({
    title,
    type = 'button',
    onClick,
    disabled = false,
}: {
    disabled?: boolean
    title: string
    type?: 'button' | 'submit'
    onClick?: () => void
}) => {
    return (
        <button
            className={styles.button}
            onClick={onClick}
            disabled={disabled}
            type={type}
        >
            {title}
        </button>
    )
}
