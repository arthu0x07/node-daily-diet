import request from 'supertest'
import { it, expect, beforeAll, afterAll, describe } from 'vitest'
import { app } from '@/app'
import { knex } from '@/database'
import { randomUUID } from 'crypto'
import { UserPayload } from '@/@types/fastify'

describe('User Routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  afterAll(async () => {
    await knex.destroy()
  })

  it('should be able to create a new meal with an existent user', async () => {
    const { email, name, password } = {
      email: `test${randomUUID()}@gmail.com`,
      name: 'test',
      password: '123456',
    }

    const registerResponse = await request(app.server)
      .post('/users/register')
      .send({
        email,
        name,
        password,
      })

    expect(registerResponse.status).toEqual(201)

    const user = await knex('users').where('email', email).first()

    expect(user).toMatchObject({
      email,
      name,
      password: expect.any(String),
    })

    const loginResponse = await request(app.server).post('/users/login').send({
      email,
      password,
    })

    const loginToken = loginResponse.body.accessToken
    const userDecoded = app.jwt.decode(loginToken) as UserPayload | null

    expect(userDecoded?.id).toEqual(user.id)

    expect(loginResponse.status).toEqual(200)
    expect(loginToken).toBeDefined()

    const token = loginToken

    const meal = {
      name: `test${randomUUID()}`,
      userId: userDecoded?.id,
      description: 'test',
      isOnDiet: 1,
    }

    const mealResponse = await request(app.server)
      .post('/meals/register')
      .set('Cookie', `access_token=${token}`)
      .send(meal)

    expect(mealResponse.status).toEqual(201)

    const mealCreated = await knex('meals').where('name', meal.name).first()

    expect(mealCreated).toMatchObject(meal)
  })

  it('should not be able to create a new meal with an inexistent user', async () => {
    const token = 'invalid_token'

    const meal = {
      name: `test${randomUUID()}`,
      userId: randomUUID(),
      description: 'test',
      isOnDiet: 1,
    }

    const mealResponse = await request(app.server)
      .post('/meals/register')
      .set('Cookie', `access_token=${token}`)
      .send(meal)

    expect(mealResponse.status).toEqual(500)
  })

  it('should not be able to create a new meal with an invalid token', async () => {
    const token = 'invalid_token'

    const meal = {
      name: `test${randomUUID()}`,
      userId: randomUUID(),
      description: 'test',
      isOnDiet: 1,
    }

    const mealResponse = await request(app.server)
      .post('/meals/register')
      .set('Cookie', `access_token=${token}`)
      .send(meal)

    expect(mealResponse.status).toEqual(500)
  })

  it('should be able to get all meals from an existent user', async () => {
    const { email, name, password } = {
      email: `test${randomUUID()}@gmail.com`,
      name: 'test',
      password: '123456',
    }

    const registerResponse = await request(app.server)
      .post('/users/register')
      .send({
        email,
        name,
        password,
      })

    expect(registerResponse.status).toEqual(201)

    const user = await knex('users').where('email', email).first()

    expect(user).toMatchObject({
      email,
      name,
      password: expect.any(String),
    })

    const loginResponse = await request(app.server).post('/users/login').send({
      email,
      password,
    })

    const loginToken = loginResponse.body.accessToken

    expect(loginResponse.status).toEqual(200)

    const token = loginToken

    const meal = {
      name: `test${randomUUID()}`,
      userId: user.id,
      description: 'test',
      isOnDiet: Number(true),
    }

    const mealResponse = await request(app.server)
      .post('/meals/register')
      .set('Cookie', `access_token=${token}`)
      .send(meal)

    expect(mealResponse.status).toEqual(201)

    const mealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', `access_token=${token}`)

    expect(mealsResponse.status).toEqual(200)

    const meals = await knex('meals')
      .where('userId', user.id)
      .andWhere('name', meal.name)

    expect(mealsResponse.body).toMatchObject(meals)
  })
})
