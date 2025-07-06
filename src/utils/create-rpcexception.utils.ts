import { RpcException } from '@nestjs/microservices';

export function createRpcException(status: number, message: string) {
  console.error(message);
  return new RpcException({ status, message });
}
