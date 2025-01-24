
type Props = {
    text: string,
}

// Supports newline and renders text accordingly
const NewLineText = ({text}: Props) => {
    return (
        text.split('\n').map((t, index) => <div key={index}>{t}</div>)
    )
}

export default NewLineText;