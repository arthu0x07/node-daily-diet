import { FastifyReply, FastifyRequest } from 'fastify'
import { randomUUID } from 'crypto'

import { knex } from '@/database'
import { MealsErrors } from './meals.errors'
import { CreateMealsInput } from './meals.schema'
import { FastifyJWT } from '@fastify/jwt'

export async function createMeals(
  req: FastifyRequest<{ Body: CreateMealsInput }>,
  res: FastifyReply,
) {
  const { date, description, isOnDiet, name, userId } = req.body

  const token = req.cookies.access_token

  if (!token) {
    return MealsErrors.notFoundOrInvalidPass(res)
  }

  const decoded = req.jwt.verify<FastifyJWT['user']>(token)
  const tokenUserId = decoded.id

  if (userId !== tokenUserId) {
    return MealsErrors.notFoundOrInvalidPass(res)
  }

  const createdMeals = await knex('meals').insert({
    id: randomUUID(),
    userId,
    date,
    description,
    isOnDiet,
    name,
  })

  if (!createdMeals) {
    return MealsErrors.internalError(res)
  }

  return res.status(204).send()
}