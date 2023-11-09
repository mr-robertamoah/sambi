import Creator from '@/Components/Creator';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Stats({ auth }) {

    return (
        <>
        <AuthenticatedLayout
            user={auth.user?.data}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Stats</h2>}
        >
            <Head title="Stats" />

            <div className="py-12">
                <div className="w-full h-1/4 flex items-center justify-center text-sm text-gray-600">under construction</div>
            </div>

        </AuthenticatedLayout>
        
        <Creator className="mb-6 mt-2"></Creator>
        </>
    )
}