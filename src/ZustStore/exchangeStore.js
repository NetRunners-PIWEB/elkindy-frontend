import { create } from "zustand";
import ExchangeService from "../services/marketplace/exchange.service";

const useExchangeStore = create((set) => ({
  exchangesReceived: [],
  exchangesSent: [],
  loading: false,
  error: null,

  setExchangesReceived: (exchangesReceived) => set({ exchangesReceived }),
  setExchangesSent: (exchangesSent) => set({ exchangesSent }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchReceivedExchanges: async (accessToken) => {
    try {
      set({ loading: true });
      const response = await ExchangeService.fetchReceivedExchanges(
        accessToken
      );
      set({ exchangesReceived: response, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchSentExchanges: async (accessToken) => {
    try {
      set({ loading: true });
      const response = await ExchangeService.fetchSentExchanges(accessToken);
      set({ exchangesSent: response, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createExchange: async (exchangeData, accessToken) => {
    try {
      set({ loading: true });
      const response = await ExchangeService.createExchange(
        exchangeData,
        accessToken
      );
      console.log(response.data);
      set((state) => ({
        exchangesSent: [...state.exchangesSent, response.data.exchange],
        loading: false,
        error: null,
      }));
      return response;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));

export default useExchangeStore;
