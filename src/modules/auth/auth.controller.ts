import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

const getAccessToken = catchAsync(async (req, res) => {
    const { userType } = req.params;
    const email = req.query?.email;
    const payloadToken = req.headers.authorization;
    const result = await AuthServices.getTokenByFirebaseToken(
        userType,
        payloadToken ?? '',
        String(email),
    );

    const { accessToken, user } = result;
    res.cookie('token', `Bearer ${accessToken}`, {
        secure: config.server.nodeEnv === 'production',
        httpOnly: true,
    });

    sendResponse(res, {
        status: 200,
        success: true,
        message: 'Token attached',
        data: user,
    });
});

export const AuthControllers = {
    getAccessToken,
};
