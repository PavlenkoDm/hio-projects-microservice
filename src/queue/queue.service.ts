import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import {
  AuthQueueEvents,
  QueueClientsNames,
} from './constants/queue.constants';
import { SignUpDto } from '../auth/auth-dto/sign-up.dto';
import { SignInDto } from '../auth/auth-dto/sign-in.dto';
import { SignOutDto } from 'src/auth/auth-dto/sign-out.dto';

@Injectable()
export class QueueService {
  constructor(
    @Inject(QueueClientsNames.AUTH_QUEUE_CLIENT)
    private readonly authQueueClient: ClientProxy,
  ) {}

  async authSignUp(signUpDto: SignUpDto) {
    try {
      const result = await firstValueFrom(
        this.authQueueClient.send({ cmd: AuthQueueEvents.SIGN_UP }, signUpDto),
      );
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async authSignIn(signInDto: SignInDto) {
    try {
      const result = await firstValueFrom(
        this.authQueueClient.send({ cmd: AuthQueueEvents.SIGN_IN }, signInDto),
      );
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async authSignOut(signOutDto: SignOutDto) {
    try {
      const result = await firstValueFrom(
        this.authQueueClient.send(
          { cmd: AuthQueueEvents.SIGN_OUT },
          signOutDto,
        ),
      );
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
}
