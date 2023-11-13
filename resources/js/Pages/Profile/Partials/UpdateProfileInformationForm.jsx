import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import FileInput from '@/Components/FileInput';
import { useState, useEffect } from 'react';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user?.data;

    const { data, setData, post, errors, processing, recentlySuccessful, clearErrors } = useForm({
        name: user.name,
        email: user.email,
        image: user.image,
        image_id: null,
    });
    let [image, setImage] = useState({})

    useEffect(() => {
        setImage({
            src: user.image?.src,
            name: user.image?.name,
            file: null
        })
    }, [user])

    function updateImage(image) {
        if (image && data.image_id) data.image_id = null
        if (!image) data.image_id = user.image?.id
        setImage((prev) => {
            let d = {...prev}
            d.src = null
            if (image)
                d.src = URL.createObjectURL(image),
            d.name = image?.name,
            d.file = image
            return d
        })

        setData("image", image)
    }

    const submit = (e) => {
        e.preventDefault();

        post(route('profile.update'), {
            onSuccess: (res) => {
                data.image_id = res.props.auth.user.data.image?.id
                data.image = null
                setImage({
                    src: res.props.auth.user.data.image?.src,
                    name: res.props.auth.user.data.image?.name,
                    file: null
                })
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
                        onChange={(e) => {
                            clearErrors("name")
                            setData('name', e.target.value)}}
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
                        onChange={(e) => {
                            clearErrors("email")
                            setData('email', e.target.value)}}
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
                        fileId={data.image_id}
                        onChange={(e) => {
                            clearErrors("file")
                            updateImage(e.target.files.length ? e.target.files[0] : null)
                        }}
                        onDelete={(e) => {
                            clearErrors("file")
                            updateImage(null)
                        }}
                            keepFile={() => {
                                clearErrors("file")
                                setImage((prev) => {
                                    return {...prev, src: user.image?.src}
                                })
                                data.image_id = null
                            }}
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
