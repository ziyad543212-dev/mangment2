import { z } from 'zod';

const uuid = z.string().uuid();
const date = z.string().date().nullable().optional().transform((value) =>
  value ? new Date(`${value}T00:00:00.000Z`) : null
);

export const signupSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(80),
    email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
    password: z.string().min(10).max(72)
  })
});

export const signinSchema = z.object({
  body: z.object({
    email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
    password: z.string().min(1).max(72)
  })
});

const projectFields = {
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(2000).optional(),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  dueDate: date
};

export const createProjectSchema = z.object({
  body: z.object({
    title: projectFields.title,
    description: projectFields.description,
    status: projectFields.status,
    priority: projectFields.priority,
    dueDate: projectFields.dueDate
  })
});

export const updateProjectSchema = z.object({
  params: z.object({ projectId: uuid }),
  body: z.object(projectFields).partial().refine((body) => Object.keys(body).length > 0, {
    message: 'At least one field is required'
  })
});

export const projectIdSchema = z.object({ params: z.object({ projectId: uuid }) });

const taskFields = {
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  dueDate: date
};

export const createTaskSchema = z.object({
  params: z.object({ projectId: uuid }),
  body: z.object({
    title: taskFields.title,
    description: taskFields.description,
    status: taskFields.status,
    dueDate: taskFields.dueDate
  })
});

export const updateTaskSchema = z.object({
  params: z.object({ projectId: uuid, taskId: uuid }),
  body: z.object(taskFields).partial().refine((body) => Object.keys(body).length > 0, {
    message: 'At least one field is required'
  })
});

export const taskIdSchema = z.object({
  params: z.object({ projectId: uuid, taskId: uuid })
});

export const projectListSchema = z.object({
  query: z.object({
    search: z.string().trim().max(120).optional(),
    status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    sort: z.enum(['dueDate', 'createdAt', 'title']).default('createdAt'),
    order: z.enum(['asc', 'desc']).default('desc')
  })
});

export const taskListSchema = z.object({
  params: z.object({ projectId: uuid }),
  query: z.object({
    search: z.string().trim().max(120).optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
    sort: z.enum(['dueDate', 'createdAt', 'title']).default('createdAt'),
    order: z.enum(['asc', 'desc']).default('asc')
  })
});
