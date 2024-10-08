import { FastifyInstance } from 'fastify'
import { $ref } from './meals.schema'
import {
  createMeals,
  deleteMealById,
  getAllMealsByUser,
  getMealById,
  updateMeals,
} from './meals.service'

export async function mealsController(app: FastifyInstance) {
  app.post(
    '/register',
    {
      schema: {
        body: $ref('mealSchemaInput'),
        response: {
          201: $ref('mealSchemaResponse'),
        },
      },
    },
    createMeals,
  )

  app.get(
    '/',
    {
      schema: {
        response: {
          200: $ref('mealsListSchemaResponse'),
        },
      },
    },
    getAllMealsByUser,
  )

  app.get(
    '/:id',
    {
      schema: {
        params: $ref('getMealByIdQuerySchema'),
        response: {
          200: $ref('mealSchemaResponse'),
        },
      },
    },
    getMealById,
  )

  app.delete(
    '/:id',
    {
      schema: {
        params: $ref('getMealByIdQuerySchema'),
      },
    },
    deleteMealById,
  )

  app.put(
    '/:id',
    {
      schema: {
        params: $ref('getMealByIdQuerySchema'),
        body: $ref('mealSchemaInput'),
        response: {
          200: $ref('mealSchemaResponse'),
        },
      },
    },
    updateMeals,
  )
}
