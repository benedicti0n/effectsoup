"use client";

import type { JSX } from "react";
import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { authClient } from "@/lib/authClient";
import { listProjects, type ProjectSummary, deleteProject } from "@/lib/projectClient";
import { SignInDialog } from "@/components/auth/signInDialog";
import { SiteHeader } from "@/components/siteHeader";
import { SiteFooter } from "@/components/siteFooter";

export default function AccountPage(): JSX.Element {
  const { data: session, isPending } = authClient.useSession();
  const [showSignIn, setShowSignIn] = useState(false);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  useEffect(() => {
    if (!session) return;
    setProjectsLoading(true);
    listProjects()
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setProjectsLoading(false));
  }, [session]);

  const signOut = async () => {
    await authClient.signOut();
  };

  const handleDelete = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch {
      alert("Failed to delete project");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <SiteHeader />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-16">
        <div className="rounded-sm border border-hairline bg-surface-soft p-6 md:p-8">
          <h1 className="mb-6 border-b border-hairline pb-3 font-mono text-2xl font-bold text-ink">
            Account
          </h1>

          {isPending ? (
            <p className="font-mono text-base text-mute">Loading…</p>
          ) : session ? (
            <div className="space-y-6">
              <div className="flex flex-col items-start justify-between gap-4 border-b border-hairline pb-6 sm:flex-row sm:items-center">
                <p className="font-mono text-base text-body">
                  Signed in as{" "}
                  <span className="font-medium text-ink">{session.user.email}</span>
                </p>
                <button
                  onClick={signOut}
                  className="inline-flex h-9 items-center gap-1 rounded-sm border border-hairline bg-canvas px-5 font-mono text-sm text-ink hover:bg-surface-card"
                >
                  <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />
                  Sign Out
                </button>
              </div>

              <div>
                <h2 className="mb-4 font-mono text-base font-bold text-ink">Cloud Projects</h2>
                {projectsLoading ? (
                  <p className="font-mono text-base text-mute">Loading projects…</p>
                ) : projects.length === 0 ? (
                  <p className="font-mono text-base text-mute">No saved projects yet.</p>
                ) : (
                  <div className="space-y-2">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between rounded-sm border border-hairline bg-canvas p-4"
                      >
                        <div>
                          <p className="font-mono text-base font-medium text-ink">{project.title}</p>
                          <p className="font-mono text-xs text-mute">
                            {project.aspectRatio} · {new Date(project.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="font-mono text-xs text-danger hover:text-danger-hover"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="font-mono text-base text-body">
                Sign in to save projects and access them across devices.
              </p>
              <button
                onClick={() => setShowSignIn(true)}
                className="inline-flex h-9 items-center rounded-sm bg-ink px-5 font-mono text-sm font-medium text-canvas hover:bg-ink-deep"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />

      {showSignIn && <SignInDialog onClose={() => setShowSignIn(false)} />}
    </div>
  );
}
