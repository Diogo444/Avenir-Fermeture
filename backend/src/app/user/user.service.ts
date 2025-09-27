import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UserService {
  async findAll(): Promise<User[]> {
    return [];
  }
}
