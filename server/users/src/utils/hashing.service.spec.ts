import { HashingService } from './hashing.service';
import { Test } from '@nestjs/testing';

describe('HashingService', () => {
  let hashingService: HashingService;
  const plainText = 'some text';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [],
      providers: [HashingService],
    }).compile();

    hashingService = moduleRef.get<HashingService>(HashingService);
  });

  it('should return a different string than the one passed', async () => {
    const hashed = await hashingService.hash(plainText);

    expect(hashed).not.toBe(plainText);
  });

  it('should successfully compare data and its hashed version', async () => {
    const hashed = await hashingService.hash(plainText);

    const res = await hashingService.compare(plainText, hashed);

    expect(res).toBe(true);
  });

  it('should successfully compare text to its multiple hashes done at different times', async () => {
    const firstHash = await hashingService.hash(plainText);
    const secondHash = await hashingService.hash(plainText);

    const firstComparison = await hashingService.compare(plainText, firstHash);
    const secondComparison = await hashingService.compare(
      plainText,
      secondHash,
    );

    expect(firstComparison).toBe(true);
    expect(secondComparison).toBe(true);
  });
});
