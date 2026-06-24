"use client";

import type { JSX } from "react";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/authClient";
import { listProjects, type ProjectSummary, deleteProject } from "@/lib/projectClient";
import { SignInDialog } from "@/components/auth/signInDialog";

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
    <main className="min-h-screen bg-charcoal p-8 text-neon-cream">
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-surface p-8">
        <h1 className="mb-6 text-2xl font-bold">Account</h1>

        {isPending ? (
          <p className="text-white/50">Loading…</p>
        ) : session ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-white/70">
                Signed in as <span className="text-white">{session.user.email}</span>
              </p>
              <button
                onClick={signOut}
                className="rounded-lg border border-white/10 px-6 py-2 text-sm hover:bg-white/5"
              >
                Sign Out
              </button>
            </div>

            <div>
              <h2 className="mb-4 text-lg font-semibold">Cloud Projects</h2>
              {projectsLoading ? (
                <p className="text-white/50">Loading projects…</p>
              ) : projects.length === 0 ? (
                <p className="text-white/50">No saved projects yet.</p>
              ) : (
                <div className="space-y-3">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between rounded-lg border border-white/10 bg-ink p-4"
                    >
                      <div>
                        <p className="font-medium">{project.title}</p>
                        <p className="text-xs text-white/50">
                          {project.aspectRatio} · {new Date(project.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="text-xs text-red-400 hover:text-red-300"
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
            <p className="text-white/70">Sign in to save projects and unlock Premium features.</p>
            <button
              onClick={() => setShowSignIn(true)}
              className="rounded-lg bg-neon-pink px-6 py-2 text-sm font-semibold text-white hover:bg-neon-pink/90"
            >
              Sign In
            </button>
          </div>
        )}
      </div>

      {showSignIn && <SignInDialog onClose={() => setShowSignIn(false)} />}
    </main>
  );
}
