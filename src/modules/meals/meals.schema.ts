import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

const createMealsSchema = z.object({
  userId: z.string({
    required_error: 'User ID is required',
    invalid_type_error: 'User ID must be a string',
  }),
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  }),
  description: z.string({
    required_error: 'Description is required',
    invalid_type_error: 'Description must be a string',
  }),
  isOnDiet: z.boolean({
    required_error: 'Is on diet is required',
    invalid_type_error: 'Is on diet must be a boolean',
  }),
  date: z
    .string({
      required_error: 'Date is required',
      invalid_type_error: 'Date must be a string',
    })
    .date(),
})

export type CreateMealsInput = z.infer<typeof createMealsSchema>

const createMealsResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  description: z.string(),
  isOnDiet: z.boolean(),
  date: z.date(),
})

const getAllMealsByUserSchema = z.object({
  id: z.string({
    required_error: 'ID is required',
    invalid_type_error: 'ID must be a string',
  }),
  userId: z.string({
    required_error: 'User ID is required',
    invalid_type_error: 'User ID must be a string',
  }),
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  }),
  description: z.string({
    required_error: 'Description is required',
    invalid_type_error: 'Description must be a string',
  }),
  isOnDiet: z.boolean({
    required_error: 'Is on diet is required',
    invalid_type_error: 'Is on diet must be a boolean',
  }),
  date: z
    .string({
      required_error: 'Date is required',
      invalid_type_error: 'Date must be a string',
    })
    .date(),
})

export type getAllMealsByUserResponse = z.infer<typeof getAllMealsByUserSchema>

const getAllMealsByUserResponseSchema = z.array(getAllMealsByUserSchema)

export const { schemas: mealsSchemas, $ref } = buildJsonSchemas(
  {
    createMealsSchema,
    createMealsResponseSchema,
    getAllMealsByUserSchema,
    getAllMealsByUserResponseSchema,
  },
  {
    $id: 'meals',
  },
)
