import { prisma } from '../lib/prisma.js';
import { activityData } from '../services/activity.js';

export async function listProjects(req, res) {
  const { search, status, priority, sort, order } = req.validated.query;
  const projects = await prisma.project.findMany({
    where: {
      userId: req.user.id,
      ...(status && { status }),
      ...(priority && { priority }),
      ...(search && { title: { contains: search, mode: 'insensitive' } })
    },
    orderBy: { [sort]: order },
    include: { _count: { select: { tasks: true } } }
  });
  return res.json({ projects });
}

export async function createProject(req, res) {
  const data = req.validated.body;
  const project = await prisma.$transaction(async (tx) => {
    const created = await tx.project.create({
      data: { ...data, userId: req.user.id }
    });
    await tx.activity.create({
      data: activityData({
        userId: req.user.id,
        projectId: created.id,
        action: 'CREATED',
        entity: 'PROJECT',
        summary: `Created project "${created.title}"`,
        snapshot: { title: created.title, status: created.status }
      })
    });
    return created;
  });
  return res.status(201).json({ project });
}

export async function getProject(req, res) {
  const project = await prisma.project.findFirst({
    where: { id: req.validated.params.projectId, userId: req.user.id },
    include: {
      tasks: { orderBy: [{ createdAt: 'asc' }] },
      _count: { select: { tasks: true } }
    }
  });
  if (!project) return res.status(404).json({ error: 'Project not found' });
  return res.json({ project });
}

export async function updateProject(req, res) {
  const { projectId } = req.validated.params;
  const data = req.validated.body;
  const project = await prisma.$transaction(async (tx) => {
    const existing = await tx.project.findFirst({
      where: { id: projectId, userId: req.user.id }
    });
    if (!existing) return null;
    const updated = await tx.project.update({ where: { id: projectId }, data });
    await tx.activity.create({
      data: activityData({
        userId: req.user.id,
        projectId,
        action: 'UPDATED',
        entity: 'PROJECT',
        summary: `Updated project "${updated.title}"`,
        snapshot: data
      })
    });
    return updated;
  });
  if (!project) return res.status(404).json({ error: 'Project not found' });
  return res.json({ project });
}

export async function deleteProject(req, res) {
  const { projectId } = req.validated.params;
  const deleted = await prisma.$transaction(async (tx) => {
    const project = await tx.project.findFirst({
      where: { id: projectId, userId: req.user.id }
    });
    if (!project) return false;
    await tx.activity.create({
      data: activityData({
        userId: req.user.id,
        projectId,
        action: 'DELETED',
        entity: 'PROJECT',
        summary: `Deleted project "${project.title}"`,
        snapshot: { title: project.title }
      })
    });
    await tx.project.delete({ where: { id: projectId } });
    return true;
  });
  if (!deleted) return res.status(404).json({ error: 'Project not found' });
  return res.status(204).end();
}
