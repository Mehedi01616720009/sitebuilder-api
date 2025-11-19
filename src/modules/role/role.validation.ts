import z from 'zod';

const createRoleValidationSchema = z.object({
    body: z.object({
        name: z.string(),
        description: z.string().optional(),
        permissions: z.array(z.string()).optional(),
    }),
});

const updateRoleValidationSchema = z.object({
    body: z.object({
        description: z.string().optional(),
        permissions: z.array(z.string()).optional(),
    }),
});

export const RoleValidations = {
    createRoleValidationSchema,
    updateRoleValidationSchema,
};
