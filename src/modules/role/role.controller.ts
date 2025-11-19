import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { RoleServices } from './role.service';

const createRole = catchAsync(async (req, res) => {
    const result = await RoleServices.createRoleIntoDB(req.body, req.user);
    sendResponse(res, {
        status: 201,
        success: true,
        message: 'Role created',
        data: result,
    });
});

const getRoles = catchAsync(async (req, res) => {
    const result = await RoleServices.getRolesFromDB();
    sendResponse(res, {
        status: 200,
        success: true,
        message: 'Roles retrieved',
        data: result,
    });
});

const getPermissions = catchAsync(async (req, res) => {
    const result = await RoleServices.getPermissionsFromDB(req.user);
    sendResponse(res, {
        status: 200,
        success: true,
        message: 'Role permissions retrieved',
        data: result,
    });
});

const getRole = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await RoleServices.getRoleFromDB(id, req.user);
    sendResponse(res, {
        status: 200,
        success: true,
        message: 'Role retrieved',
        data: result,
    });
});

const getRoleByName = catchAsync(async (req, res) => {
    const { name } = req.params;
    const result = await RoleServices.getRoleByNameFromDB(name, req.user);
    sendResponse(res, {
        status: 200,
        success: true,
        message: 'Role retrieved',
        data: result,
    });
});

const updateRole = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await RoleServices.updateRoleIntoDB(id, req.body, req.user);
    sendResponse(res, {
        status: 200,
        success: true,
        message: 'Role updated',
        data: result,
    });
});

const deleteRole = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await RoleServices.deleteRoleFromDB(id, req.user);
    sendResponse(res, {
        status: 200,
        success: true,
        message: 'Role deleted',
        data: result,
    });
});

export const RoleControllers = {
    createRole,
    getRoles,
    getPermissions,
    getRole,
    getRoleByName,
    updateRole,
    deleteRole,
};
