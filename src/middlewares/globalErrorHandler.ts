import { NextFunction, Request, Response } from 'express';
import { TErrorMessages } from '../interfaces/error';
import AppError from '../errors/AppError';
import config from '../config';
import sendError from '../utils/sendError';

type PgError = {
    code?: string;
    detail?: string;
    message?: string;
};

const isPgError = (err: any): err is PgError =>
    err && typeof err.code === 'string';

const globalErrorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    let status = 500;
    let message = 'Something went wrong';
    let stack: string | null = null;

    let errorMessages: TErrorMessages = [
        { path: '', message: 'Something went wrong' },
    ];

    if (isPgError(err)) {
        switch (err.code) {
            case '23505':
                status = 409;
                message = 'Duplicate value violates unique constraint';
                errorMessages = [{ path: 'Duplicate value', message }];
                break;
            case '23503':
                status = 400;
                message = 'Invalid reference to another resource';
                errorMessages = [{ path: 'Invalid reference', message }];
                break;
            case '23502':
                status = 400;
                message = 'Missing required field';
                errorMessages = [{ path: 'Missing field', message }];
                break;
            case '22P02':
                status = 400;
                message = 'Invalid input type or format';
                errorMessages = [{ path: 'Invalid input', message }];
                break;
            case '22001':
                status = 400;
                message = 'Input exceeds allowed length';
                errorMessages = [{ path: 'Allowed length', message }];
                break;
            case '42P01':
            case '42703':
                status = 500;
                message = 'Database query error (developer issue)';
                errorMessages = [{ path: 'Query', message }];
                break;
            case '40001':
            case '40P01':
                status = 503;
                message = 'Database concurrency conflict. Please retry.';
                errorMessages = [{ path: 'Concurrency', message }];
                break;
            case 'ECONNREFUSED':
            case '57P01':
                status = 503;
                message = 'Database temporarily unavailable';
                errorMessages = [{ path: 'Connection', message }];
                break;
            default:
                console.log(`Unhandled Postgres error code: ${err.code}`);
        }

        if (err.detail) message = err.detail;
    } else if (err instanceof AppError) {
        status = err.status;
        message = err.message;
        errorMessages = [{ path: '', message }];
        stack = config.nodeEnv === 'development' ? String(err.stack) : null;
    } else if (err instanceof Error) {
        message = err.message;
        errorMessages = [{ path: '', message }];
        stack = config.nodeEnv === 'development' ? String(err.stack) : null;
    } else {
        errorMessages = [{ path: '', message: 'Unknown error occurred' }];
    }

    return sendError(res, {
        status,
        message,
        errorMessages,
        stack,
    });
};

export default globalErrorHandler;
