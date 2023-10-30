export default function DashboardCard({children, title, cardRoute = ""}) {
    
    return (
        <a href={cardRoute} className="mb-4 max-w-2xl mx-auto w-full px-2 sm:px-6 lg:px-8">
            <div className="bg-white hover:bg-slate-50 overflow-hidden shadow-sm sm:rounded-lg">
                <div className="pt-6 pb-3 text-xl pl-6 text-gray-900 font-bold">{title}</div>
                <div className="px-4">
                    {children}
                </div>

            </div>
        </a>
    )
}