import {
  NestMiddleware,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';

// teste de middleware

@Injectable()
export class UserIdCheckMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('antes');

    const { id } = req.params;

    if (!id || !isValidObjectId(id)) {
      throw new BadRequestException(
        'ID inválido. Deve ser um ObjectId válido.',
      );
    }

    console.log('depois');

    next();
  }
}
