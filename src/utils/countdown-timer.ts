import { ref } from "vue";

let _interval_id: any = null;
const isWaiting = ref(false);
const clock = ref(0);

const start = (time: number = 60) => {
  isWaiting.value = true;
  clock.value = time;

  _interval_id = setInterval(() => {
    clock.value--;
    if (clock.value <= 0) {
      stop();
    }
  }, 1000);
};

const stop = () => {
  if (_interval_id) {
    clearInterval(_interval_id);
    _interval_id = null;
  }
  clock.value = 0;
  isWaiting.value = false;
};

export function useCountdownTimer() {
  return { isWaiting, clock, start, stop };
}
