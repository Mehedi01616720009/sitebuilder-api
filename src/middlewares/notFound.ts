import { NextFunction, Request, Response } from 'express';

const notFound = (req: Request, res: Response, next: NextFunction) => {
    return res.status(404).json({
        status: 404,
        success: false,
        message: 'API Not Found',
        data: null,
    });
};

export default notFound;
