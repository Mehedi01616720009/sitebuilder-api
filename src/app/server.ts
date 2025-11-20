import { Server } from 'http';
import config from '../config';
import app from './app';
import { DBConnect, Models } from '../DB/Database';
import SeedSuperAdmin from '../DB/SeedSuperAdmin';
import SeedRole from '../DB/SeedRole';
import {
    serverFailedResponse,
    serverSuccessResponse,
    serverUncaughtExceptionResponse,
    serverUnhandledRejectionResponse,
} from '../constant/server.response';

// server initialization
let server: Server;

async function main() {
    try {
        // database connection and table initialize
        const dbStatus = await DBConnect();
        await Models();
        await SeedRole();
        await SeedSuperAdmin();

        // server initial port listener
        server = app.listen(config.server.port, () => {
            serverSuccessResponse(dbStatus);
        });
    } catch (err: unknown) {
        serverFailedResponse();

        if (err instanceof Error) {
            console.log({
                status: 500,
                success: false,
                message: 'Internal server error',
                errorMessages: {
                    path: '/',
                    message: err.message,
                },
                stack:
                    config.server.nodeEnv === 'development'
                        ? err.stack
                        : undefined,
            });
        } else {
            console.log({
                status: 500,
                success: false,
                message: 'Internal server error',
                errorMessages: {
                    path: '/',
                    message: 'Main function error',
                },
            });
        }
    }
}

main();

// server unhandled rejection listener
process.on('unhandledRejection', reason => {
    serverUnhandledRejectionResponse(reason);

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});

// server uncaught exception listener
process.on('uncaughtException', err => {
    serverUncaughtExceptionResponse(err);
    process.exit(1);
});
