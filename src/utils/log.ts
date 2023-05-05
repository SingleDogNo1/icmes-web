const projectName = import.meta.env.VITE_GLOB_APP_TITLE;

export function warn(message: string) {
  console.log(
    `%c${projectName}警告:%c${message}`,
    'font-size:12px;color:white;background:#dbaa00;',
    'font-size:12px;color:#dbaa00;',
  );
}

export function error(message: string | Object) {
  throw new Error(`[${projectName} error]:${JSON.stringify(message)}`);
}
