// # IMPORTS

// Factory acting as mini localStorage db API.
export function Games() {
  const LS_KEY = "GAMES";
  const NOT_FOUND = "GAMES_KEY_NOT_FOUND";
  const INVALID_ARRAY = "GAMES_IS_INVALID_ARRAY";
  const CRITICAL = "CORRUPTED_OR_MALFORMED_GAMES";

  // # READ

  // return array of all games.
  const retrieveAllGames = () => {
    // Access GAMES in localStorage.
    const rawGames = localStorage.getItem(LS_KEY);

    // If it doesn't exist.
    if (rawGames === null) {
      const error = new Error(`GAMES record is not found in localStorage.`);

      // Manual extension.
      error.reason = NOT_FOUND;
      throw error;
    }

    try {
      // Parse the json from localStorage.
      const parsedRawGames = JSON.parse(rawGames);

      // If GAMES record is not an array.
      if (!Array.isArray(parsedRawGames)) {
        const error = new Error(
          `GAMES found in localStorage, but is not an array.`,
        );

        // Manual extension.
        error.reason = INVALID_ARRAY;
        throw error;
      }

      // If valid array. True data needed.
      return parsedRawGames;
    } catch (error) {
      const catchError = new Error(
        `CRITICAL: GAMES data is corrupted or malformed. Details: ${error.message}`,
      );

      // Manual extension.
      catchError.reason = CRITICAL;
      throw catchError;
    }
  };

  // MUTATE

  const updateGameRecord = (newGameRecord) => {
    localStorage.setItem(LS_KEY, newGameRecord);
  };

  // Delete all games and return boolean.
  const deleteAllGames = () => {
    let isDeleted = false;

    try {
      const games = retrieveAllGames();

      if (games) {
        localStorage.removeItem(LS_KEY);
        isDeleted = true;
      }
    } catch (error) {
      if (error.reason === NOT_FOUND) {
        throw new Error(`No game to delete.`);
      } else if (error.reason === INVALID_ARRAY || error.reason === CRITICAL) {
        throw new Error(
          `Could not delete an invalid game record. Check localStorage.`,
        );
      }
    }

    return isDeleted;
  };

  return {
    retrieveAllGames,
    updateGameRecord,
    deleteAllGames,
  };
}
