interface TaskCardProps {
    description: string;
    completed: boolean;
}

export default function TaskCard({ description, completed }: TaskCardProps) {
    return (
        <div className="flex gap-2 items-center">
            <img src={completed ? '/checkbox_signed.svg' : '/checkbox.svg'} alt="" />
            <p className={`${completed ? 'opacity-25' : 'opacity-100'}`}>
                {completed ? (
                    <s> {description} </s>
                ) : (
                    <> {description} </>
                )}
            </p>
        </div>
    );
}
