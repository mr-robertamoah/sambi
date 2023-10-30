import Creator from '@/Components/Creator';
import DashboardCard from '@/Components/DashboardCard';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth }) {

    const manageables = ["categories", "products", "costs", "cost items", "sales", "production"];
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12 grid grid-cols-1 md:grid-cols-2 gap-6 flex-wrap">
                <DashboardCard title="Products" cardRoute={route("product.index")}>
                    <p>This section actually lets you manage all products.</p>
                    <p>The following are some of the actions that you can perform:</p>
                    <ul className="list-disc px-6 text-sm py-2">
                        <li className="">add new products</li>
                        <li>edit existing products</li>
                        <li>delete products</li>
                    </ul>
                </DashboardCard>
                <DashboardCard title="Cost Items" cardRoute={route("product.index")}>
                    
                </DashboardCard>
                <DashboardCard title="Categories" cardRoute={route("product.index")}>
                    
                </DashboardCard>
                
            </div>

            <Creator className="mt-3"></Creator>
        </AuthenticatedLayout>
    );
}
