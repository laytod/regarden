import { z } from 'zod'

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Create user validation schema
export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required'),
  role: z.enum(['admin', 'editor']).default('editor'),
})

// Password reset request schema
export const passwordResetRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
})

// Password reset schema
export const passwordResetSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

// Change password schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
})

// Content update schema (partial, for PUT /api/admin/content)
const featureCardSchema = z.object({
  icon: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
})

const valueCardSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
})

const volunteerCardSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
})

const benefitCardSchema = z.object({
  icon: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
})

export const contentUpdateSchema = z
  .object({
    homepage: z
      .object({
        hero: z
          .object({
            heading: z.string().optional(),
            backgroundImage: z.string().optional(),
            missionHeading: z.string().optional(),
            missionText: z.string().optional(),
          })
          .optional(),
        featureCards: z.array(featureCardSchema).optional(),
        newsletter: z
          .object({
            heading: z.string().optional(),
            description: z.string().optional(),
          })
          .optional(),
      })
      .optional(),
    about: z
      .object({
        pageTitle: z.string().optional(),
        mission: z
          .object({
            heading: z.string().optional(),
            text: z.string().optional(),
            image: z.string().optional(),
          })
          .optional(),
        vision: z
          .object({
            heading: z.string().optional(),
            text: z.string().optional(),
          })
          .optional(),
        values: z
          .object({
            heading: z.string().optional(),
            image: z.string().optional(),
            cards: z.array(valueCardSchema).optional(),
          })
          .optional(),
        contact: z
          .object({
            heading: z.string().optional(),
            text: z.string().optional(),
            email: z.string().optional(),
          })
          .optional(),
      })
      .optional(),
    team: z
      .object({
        pageTitle: z.string().optional(),
        quote: z
          .object({
            text: z.string().optional(),
            attribution: z.string().optional(),
          })
          .optional(),
        galleryImages: z.array(z.string()).optional(),
        joinOurTeam: z
          .object({
            heading: z.string().optional(),
            text: z.string().optional(),
            contactEmail: z.string().optional(),
          })
          .optional(),
      })
      .optional(),
    volunteer: z
      .object({
        pageTitle: z.string().optional(),
        subtitle: z.string().optional(),
        description: z.string().optional(),
        backgroundImage: z.string().optional(),
        waysToVolunteer: z
          .object({
            heading: z.string().optional(),
            cards: z.array(volunteerCardSchema).optional(),
          })
          .optional(),
        contactCoordinator: z
          .object({
            heading: z.string().optional(),
            text: z.string().optional(),
            name: z.string().optional(),
            email: z.string().optional(),
          })
          .optional(),
        applySection: z
          .object({
            heading: z.string().optional(),
            description: z.string().optional(),
          })
          .optional(),
      })
      .optional(),
    donate: z
      .object({
        pageTitle: z.string().optional(),
        heroImage: z.string().optional(),
        howDonationHelps: z
          .object({
            heading: z.string().optional(),
            description: z.string().optional(),
          })
          .optional(),
        benefitCards: z.array(benefitCardSchema).optional(),
        donationSection: z
          .object({
            heading: z.string().optional(),
            description: z.string().optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one content section (homepage, about, team, volunteer, donate) must be provided',
  })
