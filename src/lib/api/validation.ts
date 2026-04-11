import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError, ZodSchema } from 'zod';
import { ValidationError } from './errors';
import { errorResponse, type ApiResponse } from './response';

export function validateBody<T>(schema: ZodSchema<T>, request: NextRequest): Promise<T> {
  return request.json().then((body) => {
    try {
      return schema.parse(body);
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {};
        error.issues.forEach((issue) => {
          const path = issue.path.join('.');
          if (!errors[path]) {
            errors[path] = [];
          }
          errors[path].push(issue.message);
        });
        throw new ValidationError('Validation failed', errors);
      }
      throw error;
    }
  });
}

export function validateQuery<T>(schema: ZodSchema<T>, request: NextRequest): T {
  const { searchParams } = new URL(request.url);
  const query = Object.fromEntries(searchParams.entries());

  try {
    return schema.parse(query);
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: Record<string, string[]> = {};
      error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(issue.message);
      });
      throw new ValidationError('Invalid query parameters', errors);
    }
    throw error;
  }
}

export function withValidation<T>(
  schema: ZodSchema<T>,
  handler: (data: T, request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const data =
        request.method === 'GET'
          ? validateQuery(schema, request)
          : await validateBody(schema, request);

      return await handler(data, request);
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: error.code || 'VALIDATION_ERROR',
              message: error.message,
              details: error.errors,
            },
          },
          { status: error.statusCode }
        );
      }
      return errorResponse(error as Error);
    }
  };
}
