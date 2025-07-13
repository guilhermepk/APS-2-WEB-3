interface TaskCardProps {
    task: {
        description: string,
        completed: boolean
    }
}

export default function TaskCard({ task }: TaskCardProps) {
    return (
        <div className="flex gap-2 items-center">
            <img src={task.completed ? '/checkbox_signed.svg' : '/checkbox.svg'} alt="" />
            <p className={`${task.completed ? 'opacity-50' : 'opacity-100'}`}>
                {task.completed ? (
                    <s> {task.description} </s>
                ) : (
                    <> {task.description} </>
                )}
            </p>
        </div>
    );
}
