import z from 'zod';

const createAdminValidationSchema = z.object({
    body: z.object({
        email: z.email(),
        name: z.string(),
        phone: z.string(),
        role: z.enum([
            'SuperAdmin',
            'Admin',
            'Moderator',
            'Author',
            'Accountant',
        ]),
        image: z.url().optional(),
    }),
});

const updateAdminValidationSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        role: z
            .enum(['SuperAdmin', 'Admin', 'Moderator', 'Author', 'Accountant'])
            .optional(),
        status: z.enum(['Active', 'Deactive', 'Blocked']).optional(),
        image: z.url().optional(),
    }),
});

export const AdminValidations = {
    createAdminValidationSchema,
    updateAdminValidationSchema,
};
