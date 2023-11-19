import Creator from '@/Components/Creator';
import DashboardCard from '@/Components/DashboardCard';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ 
    auth, products, categories, users, costItems, 
    permissions, stats, production, sales, costs, discounts
}) {
    
    return (
        <>
        <AuthenticatedLayout
            user={auth.user?.data}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12 grid grid-cols-1 md:grid-cols-2 gap-6 flex-wrap">
                {stats != null && <DashboardCard noNumberOfEntries={true} title="stats" cardRoute={route("stats.index")}>
                    <p>This section allows you to see the various statistics on each of the important entities. Remember, the filter is your best friend here.</p>
                    <p>The following are some of information you will see on that page:</p>
                    <ul className="list-disc px-6 text-sm py-2">
                        <li className="">number of products and cost/sale/production associated with each</li>
                        <li>number of cost items and costs associated with each</li>
                        <li>cost categories and cost associated with each</li>
                        <li>etc</li>
                    </ul>
                </DashboardCard>}

                {products != null && <DashboardCard numberOfEntries={products} title="Products" cardRoute={route("product.index")}>
                    <p>This section actually lets you manage all products depending on your permissions.</p>
                    <p>The following are some of the actions that you can perform:</p>
                    <ul className="list-disc px-6 text-sm py-2">
                        <li className="">add new products</li>
                        <li>edit existing products</li>
                        <li>delete products</li>
                    </ul>
                </DashboardCard>}
                
                {users != null && (<DashboardCard numberOfEntries={users} title="Users" cardRoute={route("user.index")}>
                    <p>This section actually lets you manage all other users depending on your permissions.</p>
                    <p>The following are some of the actions that you can perform:</p>
                    <ul className="list-disc px-6 text-sm py-2">
                        <li>edit existing users</li>
                        <li>edit assign permissions</li>
                        <li>delete users</li>
                    </ul>
                </DashboardCard>)}

                {permissions != null && <DashboardCard numberOfEntries={permissions} title="permissions" cardRoute={route("permission.index")}>
                    <p>This section actually lets you manage categories for cost items depending on your permissions. Example is having a category like Material Cost under which cost items such as Sand, Dust, etc, fall.</p>
                    <p>The following are some of the actions that you can perform:</p>
                    <ul className="list-disc px-6 text-sm py-2">
                        <li className="">add new categories for cost items</li>
                        <li>edit existing categories</li>
                        <li>delete categories</li>
                    </ul>
                </DashboardCard>}

                {costItems != null && <DashboardCard numberOfEntries={costItems} title="Cost Items" cardRoute={route("cost_item.index")}>
                    <p>This section actually lets you manage all cost items depending on your permissions.</p>
                    <p>The following are some of the actions that you can perform:</p>
                    <ul className="list-disc px-6 text-sm py-2">
                        <li className="">add new cost items</li>
                        <li>edit existing cost items</li>
                        <li>delete cost items</li>
                    </ul>
                </DashboardCard>}

                {categories != null && <DashboardCard numberOfEntries={categories} title="Categories" cardRoute={route("category.index")}>
                    <p>This section actually lets you manage categories for cost items depending on your permissions. Example is having a category like Material Cost under which cost items such as Sand, Dust, etc, fall.</p>
                    <p>The following are some of the actions that you can perform:</p>
                    <ul className="list-disc px-6 text-sm py-2">
                        <li className="">add new categories for cost items</li>
                        <li>edit existing categories</li>
                        <li>delete categories</li>
                    </ul>
                </DashboardCard>}

                {production != null && <DashboardCard numberOfEntries={production} title="production" cardRoute={route("production.index")}>
                    <p>This section actually lets you manage production. You will get to deal with the products produced at each time.</p>
                    <p>The following are some of the actions that you can perform:</p>
                    <ul className="list-disc px-6 text-sm py-2">
                        <li className="">make production entries</li>
                        <li>edit production entries</li>
                        <li>delete entries</li>
                    </ul>
                </DashboardCard>}
                
                {costs != null && <DashboardCard numberOfEntries={costs} title="costs" cardRoute={route("cost.index")}>
                    <p>This section actually lets you manage costs. Here, you will deal with each cost incurred, regarding a cost item, at a particular time.</p>
                    <p>The following are some of the actions that you can perform:</p>
                    <ul className="list-disc px-6 text-sm py-2">
                        <li className="">make cost entries</li>
                        <li>edit cost entries</li>
                        <li>delete entries</li>
                    </ul>
                </DashboardCard>}
                
                {sales != null && <DashboardCard numberOfEntries={sales} title="sales" cardRoute={route("sale.index")}>
                    <p>This section actually lets you manage all sales. This page lets you deal with all the products sold at a particular point in time. Timing is everything.</p>
                    <p>The following are some of the actions that you can perform:</p>
                    <ul className="list-disc px-6 text-sm py-2">
                        <li className="">make sales entries</li>
                        <li>edit sales entries</li>
                        <li>delete entries</li>
                    </ul>
                </DashboardCard>}
                
                {discounts != null && <DashboardCard numberOfEntries={discounts} title="discounts" cardRoute={route("discount.index")}>
                    <p>This section actually lets you manage all discounts. This page allows you to handle discounts allowable on the platform.</p>
                    <p>The following are some of the actions that you can perform:</p>
                    <ul className="list-disc px-6 text-sm py-2">
                        <li className="">add new discounts</li>
                        <li>edit discounts</li>
                        <li>delete discounts</li>
                    </ul>
                </DashboardCard>}
            </div>
        </AuthenticatedLayout>

        <Creator className="mb-6 mt-2"></Creator>
        </>
    );
}
