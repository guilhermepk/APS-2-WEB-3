'use client'

import createProject from "@/apis/backend/projects/create-project";
import findAllUsers from "@/apis/backend/users/find-all-users";
import CustomSelect, { Option } from "@/components/CustomSelect";
import iziToast from "izitoast";
import { redirect } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function CreateProjectPage() {
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [selectedUsers, setSelectedUsers] = useState<Option<number>[] | Option<number>>([]);
    const [users, setUsers] = useState<{ id: number, name: string }[]>([]);

    useEffect(() => {
        async function getUsers() {
            setUsers(await findAllUsers());
        }

        getUsers();
    }, []);

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        await createProject({
            name,
            description,
            userIds: Array.isArray(selectedUsers)
                ? selectedUsers.map(item => item.value)
                : [selectedUsers.value]
        });

        iziToast.success({
            title: 'Sucesso!',
            message: 'Projeto criado.',
            timeout: 1000 * 3,
            position: "topRight"
        });

        redirect('/')
    }

    return (
        <div className="max-w-xl mx-auto">
            <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                <h1 className="text-center text-2xl font-bold mb-6 my-[50px]">Criar um novo projeto</h1>

                <div>
                    <label htmlFor="name" className="block font-medium mb-1">Nome do projeto *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        maxLength={100}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                    <p className="text-sm opacity-50">Máximo de 100 caracteres</p>
                </div>

                <div>
                    <label htmlFor="description" className="block font-medium mb-1">Descrição (opcional)</label>
                    <textarea
                        id="description"
                        name="description"
                        className="w-full p-2 border border-gray-300 rounded resize-y min-h-[100px]"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                    />
                </div>

                <CustomSelect
                    options={users.map(user => ({ label: user.name, value: user.id }))}
                    value={selectedUsers}
                    onChange={(newValue) => setSelectedUsers(newValue)}
                    multiSelect
                />

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
                >
                    Criar projeto
                </button>
            </form>
        </div >
    );
}
