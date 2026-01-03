type SpacerT = {
    value?: number | string
}
export const Spacer = ({ value = 8 }: SpacerT) => {
    const style = { marginTop: value }
    return <div style={style}></div>
}
