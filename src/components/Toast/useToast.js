import { createToast } from "./toastManager";

export const useToast = () => {
  return {
    success: (message, duration = 2500) =>
      createToast(message, "success", duration),
    error: (message, duration = 2500) =>
      createToast(message, "error", duration),
    info: (message, duration = 2500) => createToast(message, "info", duration),
  };
};
