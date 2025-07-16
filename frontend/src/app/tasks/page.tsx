'use client'

import findAllTasks from "@/apis/backend/tasks/find-all-tasks";
// import CustomSelect from "@/components/CustomSelect";
import TaskList from "@/components/TaskList";
import { Suspense } from "react";

export default function TasksPage() {
    const tasks = findAllTasks();

    // const options = [
    //     { value: 'opcao1', label: 'Opção 1' },
    //     { value: 'opcao2', label: 'Opção 2' },
    //     { value: 'opcao3', label: 'Opção 3' },
    // ];

    return (
        <div
            className={`flex items-center justify-center flex-col`}
        >
            <h1 className="my-[50px]"> Todas as tarefas </h1>

            {/* <CustomSelect
                options={[
                    { value: null, label: 'Visualizar todas' },
                    { value: true, label: 'Somente concluídas' },
                    { value: false, label: 'Somente pendentes' },
                ]}
                value="a"
                onChange={() => { }}
            /> */}

            <Suspense fallback={<p> Carregando... </p>}>
                <TaskList tasks={tasks} />
            </Suspense>
        </div>
    );
}