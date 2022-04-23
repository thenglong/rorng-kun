import * as express from 'express';

import {
  ContainerTypes,
  createValidator,
  ValidatedRequest,
  ValidatedRequestSchema,
} from 'express-joi-validation';
import * as Joi from 'joi';

import { createMovie, getMovies } from '../services/movie.servce';

const validator = createValidator();

const createMovieSchema = Joi.object({
  title: Joi.string().required(),
}).required();

export interface CreateMovie {
  title: string;
}

interface CreateMovieRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: CreateMovie;
}

const movieRouter = express.Router();

// get movies
movieRouter.get('/', async (req, res) => {
  return getMovies(res);
});

// create a movie
movieRouter.post(
  '/',
  validator.body(createMovieSchema),
  async (req: ValidatedRequest<CreateMovieRequestSchema>, res) => {
    return createMovie(req.body, res);
  }
);

export default movieRouter;
