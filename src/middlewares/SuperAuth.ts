import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { ROLES } from '../constant/role';

const SuperAuth = () => {
    return catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const { token } = req.cookies;

            // take only token from 'Bearer token'
            const accessToken = token?.split(' ')[1];
            if (!accessToken) {
                throw new AppError(401, 'You are not authorized');
            }

            // token verify
            jwt.verify(
                accessToken as string,
                config.jwt.secret as string,
                function (err, decoded) {
                    if (err) {
                        throw new AppError(401, 'You are not authorized');
                    }

                    const decodedRole = (decoded as JwtPayload).role;
                    if (decodedRole !== ROLES.SuperAdmin) {
                        throw new AppError(401, 'You are not authorized');
                    }

                    // set user in request
                    req.user = decoded as JwtPayload;
                    next();
                },
            );
        },
    );
};

export default SuperAuth;
