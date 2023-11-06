export default function Image({className = "", alt, src, ...props}) {

    return (
        <img {...props} className={`object-contain w-full my-auto ${className}`} src={src} alt={alt} />
    )
}