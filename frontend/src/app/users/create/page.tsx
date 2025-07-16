'use client'

import createUser from "@/apis/backend/users/create-user";
import iziToast from "izitoast";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function CreateUserPage() {
    const [name, setName] = useState<string>('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        await createUser({ name });

        iziToast.success({
            title: 'Sucesso!',
            message: 'Usuário criado.',
            timeout: 1000 * 3,
            position: "topRight"
        });

        redirect('/users');
    }

    return (
        <div className="max-w-xl mx-auto">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <h1 className="text-center text-2xl font-bold mb-6 my-[50px]">Criar um novo usuário</h1>

                <div>
                    <label htmlFor="name" className="block font-medium mb-1">Nome do usuário *</label>
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

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
                >
                    Criar usuário
                </button>
            </form>
        </div >
    );
}