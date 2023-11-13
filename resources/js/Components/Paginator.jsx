import PrimaryButton from "./PrimaryButton";

export default function Paginator({
    onClickNext, onClickPrevious, disableNext, disablePrevious, hasFirstAndLast, className,
    onClickLast, disableLast, onClickFirst, disableFirst,
}) {

    return (
        <div className={`flex pb-4 justify-center px-6 sm:items-center sm:justify-between max-w-3xl mx-auto ${className}`}>
            <div>
                {hasFirstAndLast &&(<PrimaryButton className="mr-2" disabled={disableFirst} onClick={onClickFirst}>first</PrimaryButton>)}
                <PrimaryButton className="mx-2" disabled={disablePrevious} onClick={onClickPrevious}>previous</PrimaryButton>
            </div>
            <div>
                <PrimaryButton className="mx-2" disabled={disableNext} onClick={onClickNext}>next</PrimaryButton>
                {hasFirstAndLast &&(<PrimaryButton className="ml-2" disabled={disableLast} onClick={onClickLast}>last</PrimaryButton>)}
            </div>
        </div>
    )
}