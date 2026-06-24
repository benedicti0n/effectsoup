export type ProjectSummary = {
  id: string;
  title: string;
  thumbnailKey: string;
  aspectRatio: string;
  createdAt: string;
  updatedAt: string;
};

export type ProjectDetail = ProjectSummary & {
  sourceImageKey: string;
  effectGraphJson: string;
};

export async function listProjects(): Promise<ProjectSummary[]> {
  const response = await fetch("/api/projects");
  if (!response.ok) throw new Error("Failed to load projects");
  const data = (await response.json()) as { projects: ProjectSummary[] };
  return data.projects;
}

export async function getProject(projectId: string): Promise<ProjectDetail> {
  const response = await fetch(`/api/projects/${projectId}`);
  if (!response.ok) throw new Error("Failed to load project");
  const data = (await response.json()) as { project: ProjectDetail };
  return data.project;
}

export async function createProject(payload: {
  title: string;
  sourceImageKey: string;
  thumbnailKey: string;
  aspectRatio: string;
  effectGraphJson: string;
}): Promise<{ projectId: string }> {
  const response = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("Failed to save project");
  return (await response.json()) as { projectId: string };
}

export async function updateProject(
  projectId: string,
  payload: Partial<{
    title: string;
    sourceImageKey: string;
    thumbnailKey: string;
    aspectRatio: string;
    effectGraphJson: string;
  }>
): Promise<void> {
  const response = await fetch(`/api/projects/${projectId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("Failed to update project");
}

export async function deleteProject(projectId: string): Promise<void> {
  const response = await fetch(`/api/projects/${projectId}`, {
    method: "DELETE"
  });
  if (!response.ok) throw new Error("Failed to delete project");
}

export async function createSignedUploadUrl(payload: {
  fileName: string;
  contentType: "image/jpeg" | "image/png" | "image/webp";
  fileSize: number;
}): Promise<{ key: string; uploadUrl: string }> {
  const response = await fetch("/api/uploads/createSignedUpload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("Failed to create upload URL");
  return (await response.json()) as { key: string; uploadUrl: string };
}

export async function uploadToSignedUrl(url: string, file: Blob): Promise<void> {
  const response = await fetch(url, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type }
  });
  if (!response.ok) throw new Error("Failed to upload file");
}
