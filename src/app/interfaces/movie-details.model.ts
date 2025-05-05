import { Movie } from "./movie.model";


export interface MovieDetails extends Movie {

    budget: number,
    genres: genre[],
    homepage: string,
    imdb_id: string,
    origin_country: string[],
    production_companies: companies[],
    production_countries: countries[],
    runtime: number,
    revenue: number,
    spoken_languages: languages[],
    status: string,
    tagline: string

}

export interface genre {

    id: number,
    name: string

}

export interface companies {

    id: number,
    logo_path: string | null,
    name: string,
    origin_country: string

}

export interface countries {

    iso_3166_1: string,
    name: string


}
export interface languages {

    english_name: string,
    iso_639_1: string,
    name: string

}