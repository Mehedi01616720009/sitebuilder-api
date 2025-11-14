import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminServices } from './admin.service';

const createAdmin = catchAsync(async (req, res) => {
    const result = await AdminServices.createAdminIntoDB(req.body);
    sendResponse(res, {
        status: 201,
        success: true,
        message: 'Admin created',
        data: result,
    });
});

const getAdmins = catchAsync(async (req, res) => {
    const result = await AdminServices.getAdminsFromDB(req.query);
    sendResponse(res, {
        status: 200,
        success: true,
        message: 'Admins retrieved',
        data: result,
    });
});

const getAdmin = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await AdminServices.getAdminFromDB(id);
    sendResponse(res, {
        status: 200,
        success: true,
        message: 'Admin retrieved',
        data: result,
    });
});

const updateAdmin = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await AdminServices.updateAdminIntoDB(id, req.body);
    sendResponse(res, {
        status: 200,
        success: true,
        message: 'Admin updated',
        data: result,
    });
});

const updateAdminSelf = catchAsync(async (req, res) => {
    const result = await AdminServices.updateAdminSelfIntoDB(
        req.user,
        req.body,
    );
    sendResponse(res, {
        status: 200,
        success: true,
        message: 'Admin updated',
        data: result,
    });
});

const verifyAdmin = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await AdminServices.verifyAdminEmailIntoDB(id);
    sendResponse(res, {
        status: 200,
        success: true,
        message: 'Admin verified',
        data: result,
    });
});

const deleteAdmin = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await AdminServices.deleteAdminFromDB(id);
    sendResponse(res, {
        status: 200,
        success: true,
        message: 'Admin deleted',
        data: result,
    });
});

export const AdminControllers = {
    createAdmin,
    getAdmins,
    getAdmin,
    updateAdmin,
    updateAdminSelf,
    verifyAdmin,
    deleteAdmin,
};
