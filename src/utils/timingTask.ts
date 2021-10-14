/* 定时任务 */
import { clone, defaults, has, isFunction, isArray, isEmpty } from 'lodash-es';
import parser from 'cron-parser';

const defaultOptions = {
  isOnce: false,
  isStart: true,
  isGlobal: false,
  params: null,
};
let taskInternalCallbacks = {};
let taskMonitorHandler = false;

export function addTaskListener(
  cronTime,
  callback,
  options = { isOnce: false, isStart: true, isGlobal: false, params: null },
) {
  if (!options) {
    options = clone(defaultOptions);
  } else {
    defaults(options, defaultOptions);
  }

  let result = true;
  options.isOnce = options.isOnce === true;
  options.isStart = options.isStart === true;
  options.isGlobal = options.isGlobal === true;

  let callbackColl: any = [];
  if (has(taskInternalCallbacks, cronTime)) {
    const existItem = taskInternalCallbacks[cronTime];
    callbackColl = existItem.callbacks = existItem.callbacks || callbackColl;
  } else {
    taskInternalCallbacks[cronTime] = {
      callbacks: callbackColl,
      parser: parser.parseExpression(cronTime),
    };
  }

  for (let i = 0, l = callbackColl.length; i < l; i++) {
    const existCallbackItem = callbackColl[i];
    if (existCallbackItem === callback) {
      result = false;
      break;
    }
  }

  if (result === true) {
    if (isFunction(callback)) {
      // @ts-ignore
      callback._status = { executed: false };
      // @ts-ignore
      callback._options = options;
      callbackColl.push(callback);
      if (options.isStart) {
        startTaskMonitor();
      }
    } else {
      result = false;
    }
  }

  return result;
}

export function hasTaskListener(cronTime, callback) {
  let result = false;
  const paramLen = arguments.length;
  if (paramLen > 1) {
    if (has(taskInternalCallbacks, cronTime)) {
      const existItem = taskInternalCallbacks[cronTime];
      const callbackColl = existItem.callbacks || [];

      for (let i = 0, l = callbackColl.length; i < l; i++) {
        const existCallbackItem = callbackColl[i];
        if (existCallbackItem === callback) {
          result = true;
          break;
        }
      }
    }
  } else if (paramLen === 1) {
    if (isFunction(cronTime)) {
      callback = cronTime;
      for (const key in taskInternalCallbacks) {
        if (hasTaskListener(key, callback)) {
          result = true;
          break;
        }
      }
    } else if (cronTime) {
      if (has(taskInternalCallbacks, cronTime)) {
        result = true;
      }
    }
  }

  return result;
}

export function removeTaskListener(cronTime, callback) {
  let result = false;
  const paramLen = arguments.length;
  if (paramLen > 1) {
    if (has(taskInternalCallbacks, cronTime)) {
      const existItem = taskInternalCallbacks[cronTime];
      const callbackColl = existItem.callbacks || [];

      for (let i = 0, l = callbackColl.length; i < l; i++) {
        const existCallbackItem = callbackColl[i];
        if (existCallbackItem === callback) {
          callbackColl.splice(i, 1);
          result = true;
          break;
        }
      }

      if (result === true) {
        if (callbackColl.length < 1) {
          delete taskInternalCallbacks[cronTime];
        }
      }
    }
  } else if (paramLen === 1) {
    if (isFunction(cronTime)) {
      callback = cronTime;
      for (const key in taskInternalCallbacks) {
        if (removeTaskListener(key, callback)) {
          result = true;
        }
      }
    } else if (cronTime) {
      if (has(taskInternalCallbacks, cronTime)) {
        delete taskInternalCallbacks[cronTime];
        result = true;
      }
    }
  }

  return result;
}

export function clearTaskListener(hasGlobal) {
  if (hasGlobal === true) {
    taskInternalCallbacks = {};
    return;
  }

  for (const key in taskInternalCallbacks) {
    const existItem = taskInternalCallbacks[key];
    const callbackColl = existItem.callbacks || [];
    let hasDeleted = false;

    for (let i = 0; i < callbackColl.length; i++) {
      const existCallbackItem = callbackColl[i];
      if (existCallbackItem._options.isGlobal === false) {
        callbackColl.splice(i, 1);
        hasDeleted = true;
        i--;
      }
    }

    if (hasDeleted === true) {
      if (callbackColl.length < 1) {
        delete taskInternalCallbacks[key];
      }
    }
  }
}

export function startTaskMonitor() {
  if (taskMonitorHandler !== true) {
    launchTaskMonitor();
  }
}

export function stopTaskMonitor() {
  taskMonitorHandler = false;
}
/** end Public Method */

/** Private Method */
function callbackTaskItemListener(cronTime, cronItem) {
  const parser = cronItem.parser;
  if (!parser.hasNext()) {
    return;
  }
  const curTime = new Date().getTime();
  const crnTime = parser.next().getTime();

  if (crnTime > curTime) {
    parser.prev();
    return;
  }
  if (crnTime <= curTime) {
    let callbacks = cronItem.callbacks;
    if (!isArray(callbacks)) {
      if (isFunction(callbacks)) {
        callbacks = [callbacks];
      } else {
        return;
      }
    }
    const removedMethods: any[] = [];
    for (let i = 0, l = callbacks.length; i < l; i++) {
      const callback = callbacks[i];
      const options = callback._options || {};
      const status = callback._status || {};
      if (isFunction(callback)) {
        try {
          const callbackParams = options.params || null;
          callback.call({ errorType: null, cronTime: cronTime }, callbackParams);
        } catch (e) {
          console.warn((e as { [index: string]: string }).message);
        }
        status.executed = true;
        if (options.isOnce === true) {
          removedMethods.push(callback);
        }
      }
    }
    for (let i = 0, l = removedMethods.length; i < l; i++) {
      removeTaskListener(cronTime, removedMethods[i]);
    }
  }
}

function callbackTasksListener() {
  for (const key in taskInternalCallbacks) {
    if (taskInternalCallbacks.hasOwnProperty(key)) {
      const item = taskInternalCallbacks[key];
      callbackTaskItemListener(key, item);
    }
  }
}

function launchTaskMonitor() {
  taskMonitorHandler = true;
  const intervalTime = 1000;

  const fetchTask = () => {
    if (isEmpty(taskInternalCallbacks)) {
      stopTaskMonitor();
    }
    if (taskMonitorHandler !== true) {
      return;
    }
    try {
      callbackTasksListener();
    } catch (e) {
      console.warn((e as { [index: string]: string }).message);
    }

    setTimeout(fetchTask, intervalTime);
  };

  fetchTask();
}
/** end Private Method */
