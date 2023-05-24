const projectName = import.meta.env.VITE_GLOB_APP_TITLE;

export const warn = (message: string) =>
  console.log(
    `%c${projectName}警告🛠:%c${message}`,
    `background: #ffeb3b; padding: 4px; border-radius: 1px 0 0 1px;  color: #fff`,
    `background: #ffeb3b; padding: 4px 4px 4px 0; border-radius: 0 1px 1px 0;  color: #fff`,
  );

export function error(message: string | Object) {
  throw new Error(`[${projectName} error]:${JSON.stringify(message)}`);
}
