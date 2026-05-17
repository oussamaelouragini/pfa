import { useNotificationStore } from "../store/notificationStore";

const INTERVAL_MINUTES = 800; // 800 minutes = 13 hours
let intervalId: ReturnType<typeof setInterval> | null = null;

export function startReminderNotifier() {
  if (intervalId) return;

  const store = useNotificationStore;

  const add = () => {
    store
      .getState()
      .addNotification("Reminder", "Don't forget to add your daily expenses!");
  };

  add();
  intervalId = setInterval(add, INTERVAL_MINUTES * 60 * 1000);
}

export function stopReminderNotifier() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
