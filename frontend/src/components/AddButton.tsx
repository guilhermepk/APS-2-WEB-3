import AddIcon from "./icons/AddIcon";

interface AddButtonProps {
    text?: string,
    className?: string,
    onClick?: () => void
}

export default function AddButton({
    text, className, onClick
}: AddButtonProps) {
    return (
        <div
            onClick={onClick}
            className={`
                flex flex-col items-center justify-center gap-8
                border rounded-[10px]
                p-4
                hover:bg-[var(--foreground)] hover:text-[var(--background)] cursor-pointer
                ${className}
            `}
        >
            <AddIcon />
            <p>{text}</p>
        </div>
    );
}