export enum AdminRole {
  SuperAdmin = 'superadmin',
  UserAdmin = 'useradmin',
  ContentAdmin = 'contentadmin',
  // Add any other roles you need
}

export enum TaskStatus {
  ToDo = 'to- do',
  InProgress = 'in_progress',
  Completed = 'completed',
}
export enum Tags {
  Urgent = 'urgent',
  Bug = 'bug',
  Feature = 'feature',
  // Add any other tags you need
}

export enum ErrorTypes {
  InternalServerError = 'Internal Server Error',
  BadRequest = 'Bad Request',
  NotFound = 'Not Found',
  InvalidTags = 'Invalid tags value',
  Unauthorized = 'Unauthorized',
  Forbidden = 'Forbidden',
  InvalidFormat = 'Invalid date format',
  // Add more as needed
}
