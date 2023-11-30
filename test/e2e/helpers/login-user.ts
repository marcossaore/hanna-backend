import * as request from 'supertest'

export const loginUser = async (
  agent: request.SuperTest<request.Test>,
  { email, document, password }
) => {
  await agent.post('/api/auth/login').send({
    email,
    document,
    password
  })
}

export const logoutUser = async (agent: request.SuperTest<request.Test>) => {
  await agent.post('/api/auth/logout').send()
}
