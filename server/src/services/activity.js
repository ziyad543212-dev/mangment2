export function activityData({ userId, projectId, taskId, action, entity, summary, snapshot }) {
  return {
    userId,
    projectId: projectId ?? null,
    taskId: taskId ?? null,
    action,
    entity,
    summary,
    snapshot: snapshot === undefined ? undefined : JSON.parse(JSON.stringify(snapshot))
  };
}
