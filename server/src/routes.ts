import { FastifyInstance } from "fastify"
import { prisma } from "./lib/prisma"
import { z } from "zod";
import dayjs from "dayjs";

export async function appRoutes(app: FastifyInstance) {
  app.post('/habits', async (req) => {
    // title, weekDays
    const createHabitBody = z.object({
      title: z.string(),
      weekDays: z.array(z.number().min(0).max(6))
    })

    const { title, weekDays } = createHabitBody.parse(req.body)

    const today = dayjs().startOf('day').toDate()

    await prisma.habit.create({
      data: {
        title,
        created_at: today,
        weekDays: {
          create: weekDays.map(weekDay => {
            return {
              week_day: weekDay,
            }
          })
        }
      }
    })
  })

  app.get('/day', async (req) => {
    const getDayParams = z.object({
      date: z.coerce.date(),
    })

    const { date } = getDayParams.parse(req.query)

    const parsedDate = dayjs(date).startOf('day')
    const weekDay = parsedDate.get('day')

    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: {
          lte: date,
        },
        weekDays: {
          some: {
            week_day: weekDay
          }
        }
      }
    })

    const day = await prisma.day.findUnique({
      where: {
        date: parsedDate.toDate(),
      },
      include: {
        dayHabits: true,
      }
    })

    const completedHabits = day?.dayHabits.map(dayHabit => {
      return dayHabit.habit_id
    }) ?? []

    return {
      possibleHabits,
      completedHabits,
    }
  })

  app.patch('/habits/:id/toggle', async (req) => {
    const toggleHabitParams = z.object({
      id: z.string().uuid(),
    })

    const { id } = toggleHabitParams.parse(req.params)

    const today = dayjs().startOf('day').toDate()

    let day = await prisma.day.findUnique({
      where: {
        date: today,
      }
    })

    if (!day) {
      day = await prisma.day.create({
        data: {
          date: today,
        }
      })
    }

    /* Verifica se o h??bito j?? existe naquele dia para
    ter verifica????o de j?? marcado ou n??o. */

    const dayHabit = await prisma.dayHabit.findUnique({
      where: {
        day_id_habit_id: {
          day_id: day.id,
          habit_id: id,
        }
      }
    })

    /* Se o h??bito j?? estava marcado e o usu??rio clicar, 
    devemos desmarcar o a caixa, caso contr??rio colocamos 
    como h??bito completo. */
    
    if (dayHabit) {
      /* Remover marca????o de completo */
      await prisma.dayHabit.delete({
        where: {
          id: dayHabit.id,
        }
      })
    } else {
      /* Completar o h??bito neste dia */
      await prisma.dayHabit.create({
        data: {
          day_id: day.id,
          habit_id: id,
        }
      })
    }

  })

  app.get('/summary', async (req) => {
    /* Esse GET deve retornar um resumo dos h??bitos 
    em um array de objetos que deve conter as seguintes 
    informa????es: data, totalDeHabitos e totalDeHabitosCompletados */

    // Para banco de dados diferente de SQLite, modificar a Query RAW abaixo

    const summary = await prisma.$queryRaw`
      SELECT 
        D.id, 
        D.date,
        (
          /* Completos no dia */
          SELECT 
            cast(count(*) as float) /* Count retorna em BigInt, precisa converter */
          FROM 
            day_habits DH 
          WHERE 
            DH.day_id = D.id
        ) as completed,
        (
          /* Total de h??bitos dispon??veis no dia */
          SELECT
            cast(count(*) as float)
          FROM
            habit_week_days HWD
          JOIN
            habits H
          ON 
            H.id = HWD.habit_id
          WHERE
            /* Formata????o da data padr??o SQLite */
            HWD.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
          AND
            /* Verifica se h??bito foi criado antes do ou no dia atual */
            H.created_at <= D.date
        ) as amount
      FROM 
        days D
    `
    
    return summary
  })
}