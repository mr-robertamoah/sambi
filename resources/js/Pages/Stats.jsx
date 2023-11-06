import Creator from '@/Components/Creator';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Stats({ auth }) {

    return (
        <AuthenticatedLayout
            user={auth.user?.data}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Stats</h2>}
        >
            <Head title="Stats" />

            <div className="py-12 grid grid-cols-1 md:grid-cols-2 gap-6 flex-wrap">
                <div>under construction</div>
            </div>

            <Creator className="mb-6 mt-2"></Creator>
        </AuthenticatedLayout>
    )
}