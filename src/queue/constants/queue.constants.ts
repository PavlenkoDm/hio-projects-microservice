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
}

export enum QueueErrors {
  HANDLER_NOT_DEFINED = 'no matching message handler defined',
}
