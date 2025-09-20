export enum QueueNames {
  AUTH = 'auth',
  PROJECTS = 'projects',
}

export enum QueueClientsNames {
  AUTH_QUEUE_CLIENT = 'AUTH_QUEUE_CLIENT',
  PROJECTS_QUEUE_CLIENT = 'PROJECTS_QUEUE_CLIENT',
}

export enum AuthQueueEvents {
  SIGN_UP = 'sign_up',
  SIGN_IN = 'sign_in',
  SIGN_OUT = 'sign_out',
  JWT_GUARD = 'jwt_guard',
  JWT_REFRESH_GUARD = 'jwt_refresh_guard',
  AUTH_REFRESH = 'auth_refresh',
}

export enum ProjectsQueueEvents {
  CREATE_PROJECT = 'create_project',
  DELETE_PROJECT_BY_ID = 'delete_project_by_id',
  GET_PROJECT_BY_ID = 'get_project_by_id',
}

export enum QueueErrors {
  HANDLER_NOT_DEFINED = 'no matching message handler defined',
}
