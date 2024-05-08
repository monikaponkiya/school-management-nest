import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
  /**
   * Create random number
   * @param {number} length
   */
  public generateRandomNumber(length: number) {
    let randomNumber = '';

    for (let i = 0; i < length; i++) {
      randomNumber += Math.floor(Math.random() * 10);
    }

    return randomNumber;
  }
}
