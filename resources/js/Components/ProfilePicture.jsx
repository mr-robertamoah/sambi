import Image from "./Image";

export default function ProfilePicture({src, size = 24, name, className = "", rounded = true, showDefaultText = true, ...props}) {

    const profileSize = ` w-${size} h-${size}`

    return (
        <div {...props} className={`flex justify-center ` + className + profileSize}>
            <div className={`bg-gray-400 flex justify-center items-center` + profileSize + (rounded ? " rounded-full" : "")}>
                {src ? 
                    <Image 
                        className={`flex justify-center items-center text-sm text-gray-600 text-ellipsis` + profileSize + (rounded ? " rounded-full" : "")}
                        alt={name} src={src}></Image> :
                    <div className={`flex justify-center items-center text-sm text-gray-600 text-ellipsis ` + profileSize}>{
                        showDefaultText ? "no image" : "..."
                    }</div>
                }
            </div>
        </div>
    )
}