class MovieService {
  getMovies() {
    return [
      {
        id: 1,
        title: "Dhurandhar The Revenge",
        description: "Jassi ko ghar ki yaad kyu nhi aai?",
        duration: "2h 15m",
        genre: "Action / Thriller",
        language: "Hindi",
        releaseDate: "2025-04-10",
      },
    ];
  }
}

export default new MovieService();
