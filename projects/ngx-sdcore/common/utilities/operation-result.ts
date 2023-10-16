export interface OperationResult {
  isSuccess: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  error: string;
}
