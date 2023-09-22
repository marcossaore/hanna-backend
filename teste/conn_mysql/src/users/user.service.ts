// user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findAll(): Promise<User[]> {
    try {
      return this.userModel.findAll();
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching users');
    }
  }
}
