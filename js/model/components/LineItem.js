// # IMPORTS

// # LINE ITEAM FACTORY
export function LineItem({ gameId, quantity } = {}) {
  const id = crypto.randomUUID();
  let subTotal = null;

  // # READ
  const getId = () => id;
  const getGameId = () => gameId;
  const getQuantity = () => quantity;
  const getSubTotal = () => {
    // Look from database
    // # TODO
    // Loop through all available Games
    // # TODO

    // Check README.md
    // TODO - still no actual inventory array created.
    const isGameFound = inventory.find((game) => game.getId() === gameId);

    // If not found.
    if (!isGameFound) {
      throw new Error(`This game does not exist in our database.`);
    }

    // If found, check stock level.
    const inStock = isGameFound.getStock();

    // If out of stock.
    if (!inStock) {
      throw new Error(`This game is currently out of stock.`);
    }

    // If in stock. Check if stock is sufficient.
    if (quantity > isGameFound.getStock()) {
      throw new Error(
        `The game has insufficient stocks. Current stock: ${isGameFound.getStock()}`,
      );
    }

    // If game has enough stocks.
    const gamePrice = isGameFound.getPriceInCents();

    subTotal = Number(gamePrice) * Number(quantity);

    return subTotal;
  };

  // # MUTATE
  const addQuantity = (count) => {
    quantity += count;
  };

  const reduceQuantity = (count) => {
    quantity -= count;
  };

  return {
    getId,
    getGameId,
    getQuantity,
    getSubTotal,
    addQuantity,
    reduceQuantity,
  };
}
