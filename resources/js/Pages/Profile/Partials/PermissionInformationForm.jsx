import { useForm, usePage } from '@inertiajs/react';
import PermissionCard from '@/Components/PermissionCard';
import { Transition } from '@headlessui/react';

export default function PermissionInformationForm({ className = '' }) {
    let user = usePage().props.auth.user?.data

    const { data, setData, errors, post, reset, processing, recentlySuccessful } = useForm({
        permission_ids: '',
        assignee_id: '',
    });
    
    function assignPermission(permission) {

        data.assignee_id = user.id
        data.permission_ids = [permission.id]

        post(route("user.permissions.update", user.id), 
        {
            onSuccess: () => {

            }
        })
    }

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Permissions</h2>

                <p className="mt-1 text-sm text-gray-600">
                    You can choose to keep which permissions you want.
                </p>
            </header>

            <div className='w-full mx-4 flex p-4 mt-4'>

                {user.permissions.map(permission => 
                    <PermissionCard
                        key={permission.id}
                        permission={permission}
                        deleteText='unassign'
                        onDelete={() => assignPermission(permission)}
                        deleteDisabled={processing}
                        className="mx-2"
                    ></PermissionCard>
                )}
            </div>

            <div className="flex items-center gap-4">
                <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out"
                    enterFrom="opacity-0"
                    leave="transition ease-in-out"
                    leaveTo="opacity-0"
                >
                    <p className="text-sm text-gray-600">Permission was successfully unassigned.</p>
                </Transition>
            </div>

        </section>
    );
}