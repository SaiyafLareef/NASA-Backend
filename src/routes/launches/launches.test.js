import request from "supertest"
import app from "../../app"

describe('test GET /launches', () => {
  test('It should return 200 response', async () => {
    const respose = await request(app)
      .get('/launches')
      .expect('Content-Type', /json/)
      .expect(200)
  })
})

describe('test POST /launches', () => {

  const completeLaunchData = {
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: 'December 27, 2030',
    destination: 'Kepler-442 b'
  }

  const launchWithDateError = {
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: 'Hello',
    destination: 'Kepler-442 b'
  }

  const launchWithoutDate = {
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    destination: 'Kepler-442 b'
  }

  const requestDate = new Date(completeLaunchData.launchDate).valueOf()

  test('It should return 201 created', async () => {
    const response = await request(app)
      .post('/launches')
      .send(completeLaunchData)
      .expect('Content-Type', /json/)
      .expect(201)

    const responseDate = new Date(response.body.launchDate).valueOf()
    expect(responseDate).toBe(requestDate)

    expect(response.body).toMatchObject(launchWithoutDate)
  })

  test('It should catch the missing properties', async () => {
    const response = await request(app)
      .post('/launches')
      .send(launchWithoutDate)
      .expect('Content-Type', /json/)
      .expect(400)

    expect(response.body).toStrictEqual({
      error: 'Missing required launch property'
    })
  })

  test('Should catch invalid dates', async () => {
    const response = await request(app)
      .post('/launches')
      .send(launchWithDateError)
      .expect('Content-Type', /json/)
      .expect(400)

    expect(response.body).toStrictEqual({
      error: 'Invalid Date'
    })
  })
})
