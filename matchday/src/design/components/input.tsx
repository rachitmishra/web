import styles from './input.module.css'

export const Input = ({
    name,
    type,
    placeholder,
    value,
    onChange,
    error,
    prefix,
}: {
    name: string
    type: 'tel' | 'number'
    placeholder: string
    value?: string
    error?: string | undefined
    prefix?: string | undefined
    onChange?: (value: string) => void
}) => {
    const inputBorderRadiusStyle = prefix
        ? styles.inputBorderRadiusWithPrefix
        : styles.inputBorderRadiusDefault
    const inputStyle = [styles.input, inputBorderRadiusStyle].join(' ')
    return (
        <div className={styles.container}>
            <div className={styles.inputContainer}>
                {prefix && <span className={styles.prefix}>{prefix}</span>}
                <input
                    className={inputStyle}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    name={name}
                    onChange={(e) => {
                        onChange?.(e.target.value ?? '')
                    }}
                />
            </div>
            {error && <p className={styles.error}>{error}</p>}
        </div>
    )
}
