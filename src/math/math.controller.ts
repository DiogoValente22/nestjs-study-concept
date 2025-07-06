import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { MathService } from './math.service';

@Controller('math')
export class MathController {
  constructor(private readonly mathService: MathService) {}

  @Get('somar/:a/:b')
  getSoma(@Param('a') a: number, @Param('b') b: number) {
    return this.mathService.getSoma(Number(a), Number(b));
  }

  @Post('/multiplicar')
  postMultiplica(@Body() multiplierData: any): number {
    return this.mathService.postMultiplica(
      Number(multiplierData.a),
      Number(multiplierData.b),
    );
  }
}
