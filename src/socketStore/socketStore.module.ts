import { Global, Module } from '@nestjs/common';

import { SocketStore } from '@/socketStore/SocketStore';

@Global()
@Module({
     imports: [],
     controllers: [],
     providers: [SocketStore],
     exports: [SocketStore],
})
export class SocketStoreModule {}
