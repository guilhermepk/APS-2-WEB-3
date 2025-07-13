import EditIcon from "./icons/EditIcon";

interface EditButtonProps {
    onClick: () => void,
    className?: string
}

export default function EditButton({
    className, onClick
}: EditButtonProps) {
    return (
        <div className={`w-[30px] h-[30px] cursor-pointer ${className}`} onClick={onClick}>
            <EditIcon className="w-full h-full text-[green]" />
        </div>
    );
}