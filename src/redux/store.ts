import { createStore, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk";
import rootReducer from ".";
import { persistStore, persistReducer } from "redux-persist";

const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? window.localStorage
      ? {
          getItem: (key: string) =>
            Promise.resolve(window.localStorage.getItem(key)),
          setItem: (key: string, value: string) => {
            window.localStorage.setItem(key, value);
            return Promise.resolve();
          },
          removeItem: (key: string) => {
            window.localStorage.removeItem(key);
            return Promise.resolve();
          },
        }
      : createNoopStorage()
    : createNoopStorage();

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth","subscription"], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);


const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export const persistor = persistStore(store);
