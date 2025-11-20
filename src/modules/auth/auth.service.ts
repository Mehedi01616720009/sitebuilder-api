import config from '../../config';
import { FirebaseAdmin } from '../../config/firebase.config';
import { Query } from '../../DB/Database';
import AppError from '../../errors/AppError';
import createToken from '../../utils/createToken';

const getTokenByFirebaseToken = async (
    userType: string,
    token: string,
    email: string,
) => {
    const firebaseToken = token?.split(' ')[1];
    if (!firebaseToken) {
        throw new AppError(401, 'You are not authorized');
    }

    const userInfo = await FirebaseAdmin.auth().verifyIdToken(firebaseToken);
    if (email !== userInfo.email) {
        throw new AppError(401, 'You are not authorized');
    }

    let tableName;
    if (userType === 'user') {
        tableName = 'Users';
    }
    if (userType === 'admin') {
        tableName = 'Admins';
    }

    if (!tableName) {
        throw new AppError(401, 'You are not authorized');
    }

    const QueryGetUser = `SELECT * FROM "${tableName}" WHERE "email" = $1`;
    const ValuesGetUser = [userInfo.email];
    const GetUser = await Query(QueryGetUser, ValuesGetUser);
    if (Number(GetUser?.rowCount) === 0) {
        throw new AppError(401, 'You are not authorized');
    }
    const User = GetUser.rows[0];

    const jwtPayload = {
        userID: User.id,
        role: User.role,
    };

    const accessToken = await createToken(
        jwtPayload,
        config.jwt.secret as string,
        Number(config.jwt.expiry),
    );

    return { accessToken, user: User };
};

export const AuthServices = {
    getTokenByFirebaseToken,
};
