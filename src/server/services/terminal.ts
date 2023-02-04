export function terminal(message: string | object | number | unknown): void {
  //CUSTOM CONSOLE LOGS FOR GRANULAR LOGGING THAT CAN BE TURNED ON OR OFF
  if (process.env.EXPRESS_CONSOLE_LOG === 'on') {
    if (typeof message === 'object') {
      console.table(message);
    } else {
      //console.log(message);
    }
  }
}
