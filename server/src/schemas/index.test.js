import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createProjectSchema,
  projectListSchema,
  signupSchema,
  updateTaskSchema
} from './index.js';

test('signup trims name and normalizes email', () => {
  const result = signupSchema.parse({
    body: { name: '  Alex  ', email: 'ALEX@example.com', password: 'long-password' }
  });
  assert.equal(result.body.name, 'Alex');
  assert.equal(result.body.email, 'alex@example.com');
});

test('project due dates are parsed as UTC dates', () => {
  const result = createProjectSchema.parse({
    body: { title: '  Launch plan ', dueDate: '2026-10-18' }
  });
  assert.equal(result.body.title, 'Launch plan');
  assert.equal(result.body.dueDate.toISOString(), '2026-10-18T00:00:00.000Z');
});

test('project list query supplies stable defaults', () => {
  const result = projectListSchema.parse({ query: {} });
  assert.equal(result.query.sort, 'createdAt');
  assert.equal(result.query.order, 'desc');
});

test('task updates reject empty updates and invalid status values', () => {
  assert.throws(() => updateTaskSchema.parse({
    params: { projectId: '550e8400-e29b-41d4-a716-446655440000', taskId: '550e8400-e29b-41d4-a716-446655440001' },
    body: {}
  }));
  assert.throws(() => updateTaskSchema.parse({
    params: { projectId: '550e8400-e29b-41d4-a716-446655440000', taskId: '550e8400-e29b-41d4-a716-446655440001' },
    body: { status: 'BLOCKED' }
  }));
});
