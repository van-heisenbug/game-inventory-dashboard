// # IMPORTS

// Factory acting as mini database adapter - localStorage.
export function Games() {
  const LS_KEY = "GAMES";

  // # READ

  // return array of all games.
  const retrieveAllGames = () => {
    // Access GAMES in localStorage.
    const rawGames = localStorage.getItem(LS_KEY);

    // If it doesn't exist.
    if (rawGames === null) {
      throw new Error(`GAMES record is not found in localStorage.`);
    }

    try {
      // Parse the json from localStorage.
      const parsedRawGames = JSON.parse(rawGames);

      // If GAMES record is not an array.
      if (!Array.isArray(parsedRawGames)) {
        throw new Error(`GAMES found in localStorage, but is not an array.`);
      }

      // If valid array. Correct data needed.
      return parsedRawGames;
    } catch (error) {
      throw new Error(
        `CRITICAL: GAMES data is corrupted or malformed. Details: ${error.message}`,
      );
    }
  };

  // MUTATE

  const updateGameRecord = (newGameRecord) => {
    localStorage.setItem(LS_KEY, JSON.stringify(newGameRecord));
    return true;
  };

  const deleteAllGames = () => {
    localStorage.removeItem(LS_KEY);
    return true;
  };

  return {
    retrieveAllGames,
    updateGameRecord,
    deleteAllGames,
  };
}
