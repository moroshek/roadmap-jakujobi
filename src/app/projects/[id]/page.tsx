/**
 * Project Detail Page
 *
 * Dynamic route for individual project deep-dive. Uses generateStaticParams for SSG.
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { loadAndTransformProjects } from "@/lib/content/transformProjects";
import { ProjectHero } from "@/components/projects/ProjectHero";
import { ProjectTabs } from "@/components/projects/ProjectTabs";
import { ProjectSidebar } from "@/components/projects/ProjectSidebar";

interface ProjectDetailPageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  const result = loadAndTransformProjects({ skipInvalid: true });
  return result.projects.map((project) => ({
    id: project.id,
  }));
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = params;
  const result = loadAndTransformProjects({ skipInvalid: true });
  const project = result.projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <nav className="mb-4 text-sm text-gray-600" aria-label="Breadcrumb">
          <Link href="/projects" className="hover:text-blue-600">
            Projects
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{project.id}</span>
        </nav>

        <ProjectHero project={project} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ProjectTabs project={project} />
          </div>
          <aside>
            <ProjectSidebar project={project} />
          </aside>
        </div>
      </div>
    </main>
  );
}
