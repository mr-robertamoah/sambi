import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import FileInput from '@/Components/FileInput';
import { useState } from 'react';
import Image from '@/Components/Image';
import ProfilePicture from '@/Components/ProfilePicture';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user?.data;

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        image: user.image,
        image_id: user.image?.id,
    });

    let newData = {
        src: user.image?.src,
        name: user.image?.name,
        file: null
    }
    let [image, setImage] = useState(newData)

    function updateImage(image) {
        if (data.image_id) data.image_id = null
        setImage((prev) => {
            let data = {...prev}
            data.src = null
            if (image)
                data.src = URL.createObjectURL(image),
            data.name = image?.name,
            data.file = image
            return data
        })

        setData("image", image)
    }

    const submit = (e) => {
        e.preventDefault();

        post(route('profile.update'), {
            onStart: () => {
                // setImage(newData)
            }
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6" encType="multipart//form-data">
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div>
                    <FileInput 
                        id="image"
                        name="image"
                        className="flex justify-end"
                        defaultFilename={data.image?.name ?? "no image"}
                        defaultButtonText="upload profile image"
                        src={image.src}
                        onChange={(e) => {
                            updateImage(e.target.files.length ? e.target.files[0] : null)
                        }}
                        onDelete={(e) => {
                            updateImage(null)
                        }}
                        getFileOnDelete={false}
                    ></FileInput>

                    <InputError message={errors.image} className="mt-2" />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 font-medium text-sm text-green-600">
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
