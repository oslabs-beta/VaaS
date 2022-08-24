export function terminal(message: string | object | number | unknown): void {
  if (process.env.EXPRESS_CONSOLE_LOG === 'on') {
    if (typeof message === 'object') {
      console.table(message);
    } else {
      console.log(message);
    }
  }
}
