import { movieCastCrew } from "./movie-cast-crew.model";

export interface MovieCastCrewResponse {

    id: number,
    cast: movieCastCrew[],
    crew: movieCastCrew[]
}
