import { Module } from '@nestjs/common';
import { EventsModule } from './infra/events/events.module';

@Module({
  imports: [EventsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
