import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TPermission } from '../@types/role';
import { ROLES } from '../constant/role';
import { Query } from '../DB/Database';
import verifyToken from '../utils/verifyToken';

const validatePermission = (requiredPermission: TPermission) => {
    return catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const { token } = req.cookies;

            // take only token from 'Bearer token'
            const accessToken = token?.split(' ')[1];
            if (!accessToken) {
                throw new AppError(401, 'You are not authorized');
            }

            const decoded = await verifyToken(
                accessToken,
                config.jwt.secret as string,
            );
            const decodedRole = decoded.role;
            if (decodedRole === ROLES.SuperAdmin) {
                // set user in request
                req.user = decoded as JwtPayload;
                return next();
            }

            // fetch role permissions and match with required permissions
            const QueryGetRole = `
                SELECT "id", "name", "permissions" 
                FROM "Roles" 
                WHERE "name" = $1 AND "isDeleted" = $2
            `;
            const ValuesGetRole = [decodedRole, false];
            const GetRole = await Query(QueryGetRole, ValuesGetRole);

            const Role = GetRole?.rows?.[0] || null;
            if (!Role || !Role.permissions.includes(requiredPermission)) {
                throw new AppError(403, 'Forbidden access');
            }

            // set user in request
            req.user = decoded as JwtPayload;
            next();
        },
    );
};

export default validatePermission;
