import { Router } from 'express';
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  updateProject
} from '../controllers/project-controller.js';
import { createTask, deleteTask, listTasks, updateTask } from '../controllers/task-controller.js';
import { asyncHandler } from '../middleware/async-handler.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createProjectSchema,
  createTaskSchema,
  projectIdSchema,
  projectListSchema,
  taskIdSchema,
  taskListSchema,
  updateProjectSchema,
  updateTaskSchema
} from '../schemas/index.js';

const router = Router();
router.use(requireAuth);

router.get('/', validate(projectListSchema), asyncHandler(listProjects));
router.post('/', validate(createProjectSchema), asyncHandler(createProject));
router.get('/:projectId', validate(projectIdSchema), asyncHandler(getProject));
router.patch('/:projectId', validate(updateProjectSchema), asyncHandler(updateProject));
router.delete('/:projectId', validate(projectIdSchema), asyncHandler(deleteProject));
router.get('/:projectId/tasks', validate(taskListSchema), asyncHandler(listTasks));
router.post('/:projectId/tasks', validate(createTaskSchema), asyncHandler(createTask));
router.patch('/:projectId/tasks/:taskId', validate(updateTaskSchema), asyncHandler(updateTask));
router.delete('/:projectId/tasks/:taskId', validate(taskIdSchema), asyncHandler(deleteTask));

export default router;
