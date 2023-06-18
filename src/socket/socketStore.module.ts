import { SocketStore } from '@/socket/SocketStore';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [SocketStore],
  exports: [SocketStore],
})
export class SocketStoreModule {}
