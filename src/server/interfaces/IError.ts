export interface IError {
  status: number;
  message: string;
  exists?: boolean;
  invalid?: boolean
}
