
type Props = {
    text: string,
}

// Supports newline and renders text accordingly
const NewLineText = ({text}: Props) => {
    return (
        text.split('\n').map(t => <div>{t}</div>)
    )
}

export default NewLineText;