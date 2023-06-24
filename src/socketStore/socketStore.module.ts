import { SocketStore } from '@/socketStore/SocketStore';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [SocketStore],
  exports: [SocketStore],
})
export class SocketStoreModule {}
