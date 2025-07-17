'use client';

import { useEffect, useState } from 'react';
import findAllProjects from '@/apis/backend/projects/find-all-projects';
import AddButton from '@/components/AddButton';
import ProjectsList from '@/components/project-list/ProjectsList';
import { FindAllProjectsResponseDto } from '@/apis/backend/projects/models/dtos/find-all-projects-response.dto';

export default function Home() {
  const [projects, setProjects] = useState<FindAllProjectsResponseDto | null>(null);

  useEffect(() => {
    async function load() {
      const data = await findAllProjects();
      setProjects(data);
    }
    load();
  }, []);

  return (
    <div className="flex items-center justify-center flex-col">
      <h1 className="mt-[50px] mb-[100px]">Projetos</h1>

      <AddButton
        className="mb-16"
        onClick={() => window.location.href = 'project/create'}
        text="Novo projeto"
      />

      {projects ? <ProjectsList projects={projects} /> : <p>Carregando...</p>}
    </div>
  );
}
