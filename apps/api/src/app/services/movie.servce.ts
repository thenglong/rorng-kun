import { Response } from "express"

import prisma from "../database/prisma-client"
import { CreateMovie } from "../routes/movie.route"

export const getMovies = async (res: Response) => {
  const movies = await prisma.movie.findMany()
  return res.json(movies)
}

export const createMovie = async (payload: CreateMovie, res: Response) => {
  const movie = await prisma.movie.create({
    data: {
      ...payload,
    },
  })
  return res.status(201).json(movie)
}
