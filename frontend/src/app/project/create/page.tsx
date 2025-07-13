'use client'

import createProject from "@/apis/backend/projects/create-project";
import { FormEvent, useState } from "react";

export default function CreateProjectPage() {
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        await createProject(name, description);
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
                    <p className="text-sm text-gray-500">Máximo de 100 caracteres</p>
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

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
                >
                    Criar projeto
                </button>
            </form>
        </div>
    );
}
