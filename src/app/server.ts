import { Server } from 'http';
import config from '../config';
import app from './app';
import { DBConnect, Models } from '../DB/Database';
import SeedSuperAdmin from '../DB/SeedSuperAdmin';
import SeedRole from '../DB/SeedRole';

// server initialization
let server: Server;

async function main() {
    try {
        // database connection and table initialize
        await DBConnect();
        await Models();
        await SeedRole();
        await SeedSuperAdmin();

        // server initial port listener
        server = app.listen(config.server.port, () => {
            console.log(`
            -----------------------------------------------------
            🚀 Server Started Successfully
            -----------------------------------------------------
            🧩 Service       : ${config.server.appName}
            🌐 Environment    : ${config.server.nodeEnv}
            🏷️ Version       : ${config.server.version}
            📡 Port          : ${config.server.port}
            🔗 Base URL      : ${config.server.baseURL}
            🗄️ Database      : Connected
            ⏰ Started At    : ${new Date().toISOString()}
            -----------------------------------------------------
            `);
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.log({
                status: 500,
                success: false,
                message: 'Internal server error',
                errorMessages: {
                    path: '/',
                    message: err.message,
                },
                stack: err.stack,
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
process.on('unhandledRejection', () => {
    console.log({ message: '--| Unhandled Rejection Detected |--' });

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});

// server uncaught exception listener
process.on('uncaughtException', () => {
    console.log({ message: '--| Uncaught Exception Detected |--' });
    process.exit(1);
});
