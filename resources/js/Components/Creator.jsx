export default function Creator({className = ""}) {
    return (
        <div className={`px-6 absolute pb-5 w-full mx-auto ` + className}>
            <div className="relative flex items-center justify-between max-w-3xl mx-auto">
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 sm:text-left">
                    <div className="flex items-center gap-4">
                        Creator
                    </div>
                </div>

                <a 
                    href="https://github.com/mr-robertamoah"
                    className="hover:text-black ml-4 text-center text-sm text-gray-500 dark:text-gray-400 sm:text-right sm:ml-0">
                    Robert Amoah
                </a>
            </div>
        </div>
    )
}