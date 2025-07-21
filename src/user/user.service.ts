import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import * as bcryptjs from 'bcryptjs';
import { SendEmailService } from 'src/send-email/send-email.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly sendEmailService: SendEmailService,
  ) {}

  async create(createUserDTO: CreateUserDTO): Promise<UserDocument> {
    const isUniqueEmail = await this.userModel.findOne({
      email: createUserDTO.email,
    });
    if (isUniqueEmail) throw new ConflictException('e-mail já cadastrado');

    const bcryptSalt = await bcryptjs.genSalt();

    const hashedPassword = await bcryptjs.hash(
      createUserDTO.password,
      bcryptSalt,
    );

    const createdUser = new this.userModel({
      ...createUserDTO,
      password: hashedPassword,
    });

    try {
      const user = await createdUser.save();

      // Envio de email na fila antigo
      // await this.welcomeQueue.add('send-welcome-email', {
      //   email: user.email,
      //   name: user.name,
      // });

      // novo
      console.log('antes do sendemailService dentro de user');
      await this.sendEmailService.sendWelcomeEmail(user.email, user.name);
      console.log('depois do sendemailService dentro de user');

      return user;
    } catch (error) {
      console.log('error create', error);
      throw new InternalServerErrorException('Erro ao criar usuário');
    }
  }

  async findAll() {
    try {
      return await this.userModel.find().select('-password').exec();
    } catch (error) {
      this.logger.error('Erro ao buscar usuários.', error);
      throw new InternalServerErrorException('Erro ao buscar usuários.');
    }
  }

  async findById(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id).select('-password').exec();

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

  // Apenas teste para usar PUT
  async updateFull(id: string, updateUserDTO: UpdatePutUserDTO): Promise<User> {
    try {
      if (updateUserDTO.email) {
        throw new ForbiddenException('E-mail não pode ser alterado');
      }

      const bcryptSalt = await bcryptjs.genSalt();
      const hashedPassword = await bcryptjs.hash(
        updateUserDTO.password,
        bcryptSalt,
      );

      const updatedUser = await this.userModel
        .findByIdAndUpdate(
          id,
          {
            ...updateUserDTO,
            password: hashedPassword,
          },
          { new: true },
        )
        .select('-password')
        .exec();

      if (!updatedUser) {
        throw new NotFoundException(`Usuário com id ${id} não encontrado.`);
      }

      return updatedUser;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      this.logger.error('Erro ao atualizar usuário.', error);
      throw new InternalServerErrorException('Erro ao atualizar usuário.');
    }
  }

  async updatePartial(id: string, updatePatchUserDTO: UpdatePatchUserDTO) {
    try {
      if (updatePatchUserDTO.email) {
        throw new ForbiddenException('E-mail não pode ser alterado');
      }

      const updateData = { ...updatePatchUserDTO };

      if (updatePatchUserDTO.password) {
        const bcryptSalt = await bcryptjs.genSalt();
        const hashedPassword = await bcryptjs.hash(
          updatePatchUserDTO.password,
          bcryptSalt,
        );
        updateData.password = hashedPassword;
      }

      const updatedPartialUser = await this.userModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .select('-password')
        .exec();

      if (!updatedPartialUser) {
        throw new NotFoundException(`Usuário com id ${id} não encontrado.`);
      }

      return updatedPartialUser;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
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

      return { message: 'Usuário deletado com sucesso.' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error('Erro ao deletar usuário.', error);
      throw new InternalServerErrorException('Erro ao deletar usuário.');
    }
  }
}
