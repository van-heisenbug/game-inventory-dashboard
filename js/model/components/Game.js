// # IMPORTS
import { STOCK_CHANGE_REASON } from "../constants/stockChangeReason.js";

// # GAME FACTORY
export function Game({
  id = crypto.randomUUID(), // now, I can omit this if it's a new build and pass saved id when rebuilding.
  name,
  stock,
  price,
  genre,
  stockHistory: savedHistory = [], // destructuring
} = {}) {
  // # MUTABLE
  // const stockHistory = [];
  const stockHistory = [...savedHistory];

  // Only saves as initial stock if there is no saveHistory data.
  // Doesn't account whether a game is actually newly added or was previously deleted.
  if (savedHistory.length === 0) {
    recordStockChange({
      quantity: stock,
      reason: STOCK_CHANGE_REASON.INITIAL_STOCK,
    });
  }

  // // # Check README.md
  // recordStockChange({
  //   quantity: stock,
  //   reason: STOCK_CHANGE_REASON.INITIAL_STOCK,
  // });

  // TODO - When I save this to local storage and rebuild
  // It will not be the same ID anymore.
  // const id = crypto.randomUUID();

  // # READ
  const getId = () => id;
  const getName = () => name;
  const getGenre = () => genre;
  const getPriceInCents = () => price;
  const getStock = () => stock;
  const getStockHistory = () => structuredClone(stockHistory);

  // AI gave me toJSON as it's a convention and easier.
  // Will use this for now while I am learning.
  const serializeGame = () => {
    return {
      id,
      name,
      genre,
      price,
      stock,
      stockHistory: structuredClone(stockHistory),
    };
  };

  // # MUTATE

  // !!! TODO - Will need to ensure new values passed are safe for mutation

  const setName = (newName) => {
    name = newName;
  };

  const setGenre = (newGenre) => {
    genre = newGenre;
  };

  const setPriceInCents = (newPrice) => {
    price = newPrice;
  };

  const addStock = (count, addReason) => {
    stock += count;

    // # MUTABLE
    const stockChange = {
      quantity: count,
      reason: normalizeReason(addReason),
    };

    recordStockChange(stockChange);
  };

  const removeStock = (count, removeReason) => {
    // !!! TODO - This is not enough validation
    if (count > stock) {
      throw new Error(`Insufficient stocks!`);
    }

    stock -= count;

    // # MUTABLE
    const stockChange = {
      quantity: -count, // Started using Claude and learnt this from him.
      reason: normalizeReason(removeReason),
    };

    recordStockChange(stockChange);
  };

  // # Check README.md
  function recordStockChange(stockChange = {}) {
    // !!! TODO - This is no validation here yet

    // Check README.md
    const stockChangeClone = {
      ...stockChange,
      // TODO - When I store this to local storage, it will not be the same when I rebuild.
      date: new Date().toISOString(),
    };

    stockHistory.push(stockChangeClone);
  }

  // # HELPER
  function normalizeReason(reason) {
    return reason.replaceAll(" ", "_").toUpperCase();
  }

  return {
    getId,
    getName,
    setName,
    getGenre,
    setGenre,
    getPriceInCents,
    setPriceInCents,
    getStock,
    getStockHistory,
    addStock,
    removeStock,
    serializeGame,
  };
}
