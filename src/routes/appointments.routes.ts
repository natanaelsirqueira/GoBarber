import { Router } from 'express'
import { getCustomRepository } from 'typeorm'
import { parseISO } from 'date-fns'

import ensureAthenticated from '../middlewares/ensureAthenticated'
import AppointmentsRepository from '../repositories/Appointments'
import CreateAppointment from '../services/CreateAppointment'

const appointmentsRouter = Router()

appointmentsRouter.use(ensureAthenticated)

appointmentsRouter.get('/', async (_request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository)
  const appointments = await appointmentsRepository.find()

  return response.json(appointments)
})

appointmentsRouter.post('/', async (request, response) => {
  const { provider_id, date } = request.body

  const parsedDate = parseISO(date)

  const createAppointment = new CreateAppointment()

  const appointment = await createAppointment.execute({
    provider_id,
    date: parsedDate,
  })

  return response.json(appointment)
})

export default appointmentsRouter
