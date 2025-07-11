import findAllProjects from "@/apis/backend/projects/find-all-projects";
import ProjectsList from "@/components/project-list/ProjectsList";
import { Suspense } from "react";

export default function Home() {
  const projects = findAllProjects();

  return (
    <div className={`
      flex items-center justify-center flex-col
    `}>
      <h1 className="mt-[50px] mb-[100px]"> Projetos </h1>

      <Suspense fallback={<p> Carregando... </p>}>
        <ProjectsList projects={projects} />
      </Suspense>
    </div>
  );
}
