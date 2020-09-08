// this Util function is implement some raw js

function debounce(fn: () => void, delay: number) {
  let timer;
  return function () {
    clearTimeout(timer);
    let args = arguments;
    timer = setTimeout(() => {
      fn.call(this, ...args);
    }, delay);
  };
}

function throttle(fn: () => void, delay: number) {
  let timer;
  return () => {
    if (!timer) {
      fn.call(this, ...arguments);
      timer = setTimeout(() => {
        timer = null;
      }, delay);
    }
  };
}

function run(gen: Generator) {
  function next(data?) {}
  next();
}
