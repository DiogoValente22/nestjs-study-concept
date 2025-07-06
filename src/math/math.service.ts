import { Injectable } from '@nestjs/common';

@Injectable()
export class MathService {
  getSoma(a: number, b: number): number {
    return a + b;
  }

  postMultiplica(a: number, b: number): number {
    return a * b;
  }
}
