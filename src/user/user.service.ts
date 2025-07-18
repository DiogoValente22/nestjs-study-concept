import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectQueue('user-welcome') private readonly welcomeQueue: Queue,
  ) {}

  async create(createUserDTO: CreateUserDTO): Promise<UserDocument> {
    const bcryptSalt = await bcryptjs.genSalt();

    createUserDTO.password = await bcryptjs.hash(
      createUserDTO.password,
      bcryptSalt,
    );

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
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      this.logger.error('Erro ao buscar usuários.', error);
      throw new InternalServerErrorException('Erro ao buscar usuários.');
    }
  }

  async findById(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) throw new NotFoundException('Usuário não encontrado');

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Erro ao buscar usuário.', error);
      throw new InternalServerErrorException('Erro ao buscar usuário.');
    }
  }

  async updateFull(id: string, updateUserDTO: UpdatePutUserDTO): Promise<User> {
    try {
      const bcryptSalt = await bcryptjs.genSalt();

      updateUserDTO.password = await bcryptjs.hash(
        updateUserDTO.password,
        bcryptSalt,
      );

      const updatedFullUser = await this.userModel
        .findByIdAndUpdate(id, updateUserDTO, { new: true })
        .exec();

      if (!updatedFullUser) {
        throw new NotFoundException(`Usuário com id ${id} não encontrado.`);
      }

      return updatedFullUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Erro ao atualizar usuário.', error);
      throw new InternalServerErrorException('Erro ao atualizar usuário.');
    }
  }

  async updatePartial(id: string, updatePatchUserDTO: UpdatePatchUserDTO) {
    try {
      const bcryptSalt = await bcryptjs.genSalt();

      updatePatchUserDTO.password = await bcryptjs.hash(
        updatePatchUserDTO.password,
        bcryptSalt,
      );
      const updatedPartialUser = await this.userModel
        .findByIdAndUpdate(id, updatePatchUserDTO, { new: true })
        .exec();

      if (!updatedPartialUser) {
        throw new NotFoundException(`Usuário com id ${id} não encontrado.`);
      }

      return updatedPartialUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error('Erro ao atualizar usuário.', error);
      throw new InternalServerErrorException('Erro ao atualizar usuário.');
    }
  }

  async delete(id: string) {
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id).exec();

      if (!deletedUser) {
        throw new NotFoundException(`Usuário com id ${id} não encontrado.`);
      }

      return deletedUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error('Erro ao deletar usuário.', error);
      throw new InternalServerErrorException('Erro ao deletar usuário.');
    }
  }
}
