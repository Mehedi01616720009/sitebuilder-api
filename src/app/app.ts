import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import secretGenerate from '../utils/secretGenerate';
import globalErrorHandler from '../middlewares/globalErrorHandler';
import notFound from '../middlewares/notFound';
import router from '../routes';

// initialize express application
const app: Application = express();

// cross origin resources
app.use(
    cors({
        origin: ['http://localhost:5173'],
        credentials: true,
    }),
);

// cookie parser
app.use(cookieParser());

// express parser
app.use(express.json());

// initial route
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        status: 200,
        success: true,
        message: 'Server is running successfully',
        data: new Date(new Date().getTime() + 6 * 60 * 60 * 1000),
    });
});

// secret generate route
app.get('/secret/:length', (req: Request, res: Response) => {
    res.status(200).json({
        status: 200,
        success: true,
        message: 'Secret has been generated successfully',
        data: secretGenerate(Number(req.params?.length || 20)),
    });
});

// application routes
app.use('/api/v1', router);

// global error handler
app.use(globalErrorHandler);

// not found api
app.use(notFound);

export default app;
