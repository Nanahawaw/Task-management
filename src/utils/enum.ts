export enum AdminRole {
  SuperAdmin = 'superadmin',
  UserAdmin = 'useradmin',
  ContentAdmin = 'contentadmin',
  // Add any other roles you need
}

export enum TaskStatus {
  Pending = 'not_started',
  InProgress = 'in_progress',
  Completed = 'completed',
}
export enum Tags {
  Urgent = 'urgent',
  Bug = 'bug',
  Feature = 'feature',
  // Add any other tags you need
}

export enum ErrorType {
  VALIDATION_ERROR = 'Validation Error',
  DATABASE_ERROR = 'Database Error',
  NOT_FOUND = 'Not Found',
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
  UNAUTHORIZED = 'Unauthorized',
  FORBIDDEN = 'Forbidden',
  BAD_REQUEST = 'Bad Request',
  DUPLICATE_TASK_ERROR = 'Task with same title exists for this user',
  //add more as needed
}

export enum UserError {
  EMAIL_ALREADY_EXISTS = 'Email already exists',
  USER_NOT_FOUND = 'User not found',
  WRONG_CREDENTIALS = 'Wrong credentials',
  UNAUTHORIZED = 'Email Verification required',
  // Add any other errors related to user authentication
}
