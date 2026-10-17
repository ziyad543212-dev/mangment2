import { prisma } from '../lib/prisma.js';

export async function getDashboard(req, res) {
  const userId = req.user.id;
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const nextWeek = new Date(today);
  nextWeek.setUTCDate(nextWeek.getUTCDate() + 7);

  const [totalProjects, completedProjects, activeTasks, completedTasks, projects, tasks, activities] =
    await Promise.all([
      prisma.project.count({ where: { userId } }),
      prisma.project.count({ where: { userId, status: 'COMPLETED' } }),
      prisma.task.count({
        where: { project: { userId }, status: { not: 'DONE' } }
      }),
      prisma.task.count({ where: { project: { userId }, status: 'DONE' } }),
      prisma.project.findMany({
        where: { userId, dueDate: { gte: today, lte: nextWeek } },
        select: { id: true, title: true, dueDate: true, status: true },
        orderBy: { dueDate: 'asc' }
      }),
      prisma.task.findMany({
        where: {
          project: { userId },
          dueDate: { gte: today, lte: nextWeek },
          status: { not: 'DONE' }
        },
        select: {
          id: true,
          title: true,
          dueDate: true,
          project: { select: { id: true, title: true } }
        },
        orderBy: { dueDate: 'asc' }
      }),
      prisma.activity.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 8
      })
    ]);

  const deadlines = [
    ...projects.map((item) => ({ ...item, entity: 'PROJECT' })),
    ...tasks.map((item) => ({ ...item, entity: 'TASK' }))
  ].sort((a, b) => a.dueDate - b.dueDate);

  return res.json({
    metrics: { totalProjects, activeTasks, completedItems: completedProjects + completedTasks, upcomingDeadlines: deadlines.length },
    deadlines,
    activities
  });
}
