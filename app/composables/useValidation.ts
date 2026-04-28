import { z } from 'zod'

export function useValidation() {
  const { t } = useI18n()

  const loginSchema = z.object({
    email: z.string().email(t('validation.invalidEmail')),
    password: z.string().min(6, t('validation.passwordMin')),
  })

  const registerSchema = z
    .object({
      email: z.string().email(t('validation.invalidEmail')),
      password: z.string().min(6, t('validation.passwordMin')),
      passwordConfirmation: z.string(),
      firstName: z.string().min(1, t('validation.firstNameRequired')).optional(),
      lastName: z.string().optional(),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: t('validation.passwordMismatch'),
      path: ['passwordConfirmation'],
    })

  const forgotPasswordSchema = z.object({
    email: z.string().email(t('validation.invalidEmail')),
  })

  const resetPasswordSchema = z
    .object({
      newPassword: z.string().min(6, t('validation.passwordMin')),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t('validation.passwordMismatch'),
      path: ['confirmPassword'],
    })

  const addressSchema = z.object({
    streetAddress: z.string().min(5, t('validation.streetMin')),
    city: z.string().min(2, t('validation.cityMin')),
    country: z.string().min(2, t('validation.countryMin')),
    postalCode: z
      .string()
      .min(3, t('validation.postalCodeMin'))
      .max(10, t('validation.postalCodeMax'))
      .regex(/^[A-Z0-9\s]+$/i, t('validation.postalCodeInvalid')),
    state: z.string().optional(),
    phone: z
      .string()
      .optional()
      .refine((v) => !v || /^\+?[\d\s\-().]{7,20}$/.test(v), t('validation.invalidPhone')),
    label: z.enum(['home', 'work', 'other']),
    isDefault: z.boolean().optional(),
  })

  return {
    loginSchema,
    registerSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    addressSchema,
  }
}

export type LoginFormData = z.infer<ReturnType<typeof useValidation>['loginSchema']>
export type RegisterFormData = z.infer<ReturnType<typeof useValidation>['registerSchema']>
export type ForgotPasswordFormData = z.infer<
  ReturnType<typeof useValidation>['forgotPasswordSchema']
>
export type ResetPasswordFormData = z.infer<ReturnType<typeof useValidation>['resetPasswordSchema']>
export type AddressFormData = z.infer<ReturnType<typeof useValidation>['addressSchema']>
