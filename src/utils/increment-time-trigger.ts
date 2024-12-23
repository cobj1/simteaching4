/**
 * 给定一个时间，每隔一段时间触发一次并且延长下次触发时间间隔，需要手动停止
 */

import { ref } from "vue";

// 累计时间 单位 秒
const timer = ref(0);
// 触发间隔 单位 秒
const clock = ref(0);
// 累计时间定时器
let timer_interval_id: any = null;
// 触发间隔定时器
let clock_timeout_id: any = null;

const start = (time: number = 60, options: any = { event() {} }) => {
  clock.value = time;

  timer_interval_id = setInterval(() => timer.value++, 1000);

  function clockTimeout() {
    clock_timeout_id = setTimeout(() => {
      if (options.event) options.event();
      clock.value = Math.ceil(clock.value + clock.value / 3);
      clockTimeout();
    }, clock.value * 1000);
  }

  clockTimeout();
};

const stop = (options: any = { event() {} }) => {
  if (options.event) options.event();
  if (timer_interval_id) {
    clearInterval(timer_interval_id);
    timer_interval_id = null;
  }
  if (clock_timeout_id) {
    clearTimeout(clock_timeout_id);
    clock_timeout_id = null;
  }
  clock.value = 0;
  timer.value = 0;
};

export function useIncrementTimeTrigger() {
  return { timer, clock, start, stop };
}
