import pool from "../config/db.js";

class MovieModel {
  // async findAll() {
  //   const result = await pool.query(
  //     "SELECT * FROM movies ORDER BY created_at DESC"
  //   );
  //   return result.rows;
  // }

  async findAll() {
    return [
      {
        id: 1,
        title: "Dhurandhar The Revenge",
        description:
          "Jassi ko ghar ki yaad kyu nhi aai? A gripping tale of revenge and redemption.",
        duration: 135,
        genre: "Action / Thriller",
        language: "Hindi",
        rating: "U/A",
        poster_url:
          "https://res.cloudinary.com/db7qmdfr2/image/upload/v1776083428/dhurandhar_the_revenge_eigjqz.png",
        created_at: "2026-04-13T12:31:42.993422",
      },
    ];
  }

  async findById(id) {
    const result = await pool.query(
      "SELECT * FROM movies WHERE id = $1",
      [id]
    );
    return result.rows[0] || [];
  }

  async create({ title, description, duration, genre, language, rating, poster_url }) {
    const result = await pool.query(
      `INSERT INTO movies (title, description, duration, genre, language, rating, poster_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, description, duration, genre, language, rating, poster_url]
    );
    return result.rows[0];
  }
}

export default new MovieModel();