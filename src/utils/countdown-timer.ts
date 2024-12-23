/**
 * 计数器，给定一个时间到期时，到期后销毁计时器
 */

import { ref } from "vue";

let _interval_id: any = null;
const isWaiting = ref(false);
const clock = ref(0);

const start = (time: number = 60, options: any = {}) => {
  isWaiting.value = true;
  clock.value = time;

  _interval_id = setInterval(() => {
    clock.value--;
    if (clock.value <= 0) {
      stop();
      if (options.event) options.event();
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
