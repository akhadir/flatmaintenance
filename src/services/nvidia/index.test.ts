import axios from 'axios';
import extractData, { ProcessedData, NVIDIA } from './index';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('../index');
const { getConfig } = require('../index');
const getConfigMock = getConfig as jest.MockedFunction<typeof getConfig>;

describe('NVIDIA Service', () => {
  const mockConfig = {
    nvidiaKey: 'test-api-key',
  };

  beforeEach(() => {
    getConfigMock.mockReturnValue(mockConfig);
  });

  afterEach(() => {
    jest.clearAllMocks();
    // @ts-ignore: accessing private static property for test reset
    NVIDIA.instance = undefined;
  });

  it('uses the OpenAI-compatible NVIDIA chat completions endpoint', async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        choices: [
          {
            message: {
              content: '{"date":"25-12-2023","amount":123.45,"description":"Test Bill","isChequeIssued":true}',
            },
          },
        ],
      },
    });

    const result: ProcessedData = await extractData('Some bill text');

    expect(result).toEqual({
      date: '25-12-2023',
      amount: 123.45,
      description: 'Test Bill',
      isChequeIssued: true,
    });
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://integrate.api.nvidia.com/v1/chat/completions',
      expect.objectContaining({
        model: 'nvidia/nemotron-3-super-120b-a12b',
      }),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-api-key',
        }),
      }),
    );
  });
});
