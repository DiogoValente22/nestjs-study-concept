import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectQueue('user-welcome') private readonly welcomeQueue: Queue,
  ) {}

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    const createdUser = new this.userModel(createUserDTO);
    const user = await createdUser.save();

    // Adiciono job de boas vindas
    await this.welcomeQueue.add('send-welcome-email', {
      email: user.email,
      name: user.name,
    });

    return user;
  }

  async findAll() {
    return await this.userModel.find().exec();
  }

  async updateFull(id: string, updateUserDTO: UpdatePutUserDTO): Promise<User> {
    return await this.userModel
      .findByIdAndUpdate(id, updateUserDTO, { new: true })
      .exec();
  }

  async updatePartial(id: string, updatePatchUserDTO: UpdatePatchUserDTO) {
    return await this.userModel
      .findByIdAndUpdate(id, updatePatchUserDTO, { new: true })
      .exec();
  }

  async delete(id: string) {
    return await this.userModel.findByIdAndDelete(id).exec();
  }
}
