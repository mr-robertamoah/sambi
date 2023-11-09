export default function Image({className = "", alt, src, ...props}) {

    return (
        <img {...props} className={`object-contain my-auto ${className}`} src={src} alt={alt} />
    )
}