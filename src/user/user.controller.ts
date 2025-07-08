import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Put,
  Body,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { UserService } from './user.service';
import { LogInterceptor } from 'src/interceptors/log.interceptor';

@UseInterceptors(LogInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    return await this.userService.findAll();
  }

  @Post()
  async createUser(@Body() createUserDTO: CreateUserDTO) {
    const user = await this.userService.create(createUserDTO);
    return {
      message: 'Usuário cadastrado com sucesso!',
      data: user,
    };
  }

  @Patch('alterar/:id')
  async changeSomeDataOfUser(
    @Param('id') id: string,
    @Body() updatePatchUserDTO: UpdatePatchUserDTO,
  ) {
    const user = await this.userService.updatePartial(id, updatePatchUserDTO);
    return {
      message: 'usuario alterado com sucesso usando Patch!',
      data: user,
    };
  }

  @Put('alterar/:id')
  async changeAllDataOfUser(
    @Param('id') id: string,
    @Body() updatePutUserDTO: UpdatePutUserDTO,
  ) {
    const data = await this.userService.updateFull(id, updatePutUserDTO);
    return {
      message: 'usuario alterado com sucesso usando Put!',
      data: data,
    };
  }

  @Delete('delete/:id')
  async deleteUserById(@Param('id') id: string) {
    await this.userService.delete(id);
    return {
      message: 'usuario deletado com sucesso.',
    };
  }
}
