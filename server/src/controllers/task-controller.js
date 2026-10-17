import { prisma } from '../lib/prisma.js';
import { activityData } from '../services/activity.js';

async function ownedProject(projectId, userId) {
  return prisma.project.findFirst({ where: { id: projectId, userId }, select: { id: true } });
}

export async function listTasks(req, res) {
  const { projectId } = req.validated.params;
  const { search, status, sort, order } = req.validated.query;
  if (!(await ownedProject(projectId, req.user.id))) {
    return res.status(404).json({ error: 'Project not found' });
  }
  const tasks = await prisma.task.findMany({
    where: {
      projectId,
      ...(status && { status }),
      ...(search && { title: { contains: search, mode: 'insensitive' } })
    },
    orderBy: { [sort]: order }
  });
  return res.json({ tasks });
}

export async function createTask(req, res) {
  const { projectId } = req.validated.params;
  if (!(await ownedProject(projectId, req.user.id))) {
    return res.status(404).json({ error: 'Project not found' });
  }
  const data = req.validated.body;
  const task = await prisma.$transaction(async (tx) => {
    const created = await tx.task.create({ data: { ...data, projectId } });
    await tx.activity.create({
      data: activityData({
        userId: req.user.id,
        projectId,
        taskId: created.id,
        action: 'CREATED',
        entity: 'TASK',
        summary: `Created task "${created.title}"`,
        snapshot: { title: created.title, status: created.status }
      })
    });
    return created;
  });
  return res.status(201).json({ task });
}

export async function updateTask(req, res) {
  const { projectId, taskId } = req.validated.params;
  const data = req.validated.body;
  const task = await prisma.$transaction(async (tx) => {
    const existing = await tx.task.findFirst({
      where: { id: taskId, projectId, project: { userId: req.user.id } }
    });
    if (!existing) return null;
    const updated = await tx.task.update({ where: { id: taskId }, data });
    await tx.activity.create({
      data: activityData({
        userId: req.user.id,
        projectId,
        taskId,
        action: 'UPDATED',
        entity: 'TASK',
        summary: `Updated task "${updated.title}"`,
        snapshot: data
      })
    });
    return updated;
  });
  if (!task) return res.status(404).json({ error: 'Task not found' });
  return res.json({ task });
}

export async function deleteTask(req, res) {
  const { projectId, taskId } = req.validated.params;
  const deleted = await prisma.$transaction(async (tx) => {
    const task = await tx.task.findFirst({
      where: { id: taskId, projectId, project: { userId: req.user.id } }
    });
    if (!task) return false;
    await tx.activity.create({
      data: activityData({
        userId: req.user.id,
        projectId,
        action: 'DELETED',
        entity: 'TASK',
        summary: `Deleted task "${task.title}"`,
        snapshot: { title: task.title }
      })
    });
    await tx.task.delete({ where: { id: taskId } });
    return true;
  });
  if (!deleted) return res.status(404).json({ error: 'Task not found' });
  return res.status(204).end();
}
