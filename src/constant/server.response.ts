import config from '../config';

export const serverSuccessResponse = (dbStatus: {
    connected: boolean;
    message?: string;
}) => {
    console.log(`
-----------------------------------------------------
🚀 Server Started Successfully
-----------------------------------------------------
🧩 Service       : ${config.server.appName}
🌱 Environment   : ${config.server.nodeEnv}
🏷️ Version       : ${config.server.version}
📡 Port          : ${config.server.port}
🔗 Base URL      : ${config.server.baseURL}
🗄️ Database      : ${dbStatus.connected ? 'Connected ✅' : 'Failed ❌:' + dbStatus.message}
⏰ Started At    : ${new Date().toISOString()}
-----------------------------------------------------
    `);
};

export const serverFailedResponse = () => {
    console.log(`
-----------------------------------------------------
❌ Server Startup Failed
-----------------------------------------------------
    `);
};

export const serverUnhandledRejectionResponse = (reason: unknown) => {
    console.error(`
-----------------------------------------------------
💥 Unhandled Rejection Detected
-----------------------------------------------------
🔍 Reason      : ${reason instanceof Error ? reason.message : reason}
📌 Action      : Server shutting down gracefully...
-----------------------------------------------------
    `);
};

export const serverUncaughtExceptionResponse = (err: unknown) => {
    console.error(`
-----------------------------------------------------
💣 Uncaught Exception Detected
-----------------------------------------------------
🔍 Error       : ${err instanceof Error ? err.message : err}
🧵 Stack       : ${process.env.NODE_ENV === 'development' && err instanceof Error ? err.stack : 'Hidden in production'}
📌 Action      : Process exiting immediately...
-----------------------------------------------------
    `);
};
