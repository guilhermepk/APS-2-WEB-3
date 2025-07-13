import { sleep } from "@/common/functions/sleep";
import { FindProjectByIdResponseDto } from "./models/dtos/find-project-by-id-response.dto";

export default async function findProjectById(id: number): Promise<FindProjectByIdResponseDto | null> {
    await sleep(1000 * 2);

    switch (id) {
        case 1:
            return {
                "id": 1,
                "name": "TCC",
                "description": "Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum",
                tasks: [
                    { id: 1, completed: true, description: 'Documento' },
                    { id: 2, completed: true, description: 'Apresentação 1' },
                    { id: 3, completed: false, description: 'Desenvolvimento' },
                    { id: 4, completed: false, description: 'Apresentação 2' }
                ],
                users: [{ id: 1, name: 'Guilherme' }]
            }
        case 2:
            return {
                "id": 2,
                "name": "Torta de limão",
                "description": null,
                tasks: [
                    { id: 5, completed: false, description: 'Comprar ingredientes' },
                    { id: 6, completed: false, description: 'Fazer' },
                    { id: 7, completed: false, description: 'Assar' }
                ],
                users: [{ id: 1, name: 'Guilherme' }, { id: 2, name: 'Betina' }]
            }
        case 3:
            return {
                "id": 3,
                "name": "Lactobacilos Lokos parte 2",
                "description": 'Jogar Mario Party e falar asneira.',
                tasks: [],
                users: [{ id: 1, name: 'Guilherme' }, { id: 3, name: 'Filipe' }, { id: 4, name: 'Leandro' }, { id: 5, name: 'Robert' }]
            }
        default:
            return null;
    }
}