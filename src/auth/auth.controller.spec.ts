import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SigninDto } from './dto/sign-in.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: Partial<AuthService>;

  beforeEach(async () => {
    authService = {
      signup: jest.fn(),
      login: jest.fn(),
      refresh: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  describe('signup', () => {
    it('should call AuthService.signup and return user data', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };
      const mockUser = { id: '123', ...createUserDto };
      const data = {
        ...mockUser,
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        expiresIn: 3600,
      };
      jest.spyOn(authService, 'signup').mockResolvedValueOnce(data);

      const result = await authController.signup(createUserDto);

      expect(authService.signup).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual({ data });
    });
  });

  describe('login', () => {
    it('should call AuthService.login and return user data', async () => {
      const signinDto: SigninDto = {
        username: 'testuser',
        password: 'password123',
      };
      const mockUser = {
        id: '123',
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
      };
      const data = {
        ...mockUser,
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        expiresIn: 3600,
      };
      jest.spyOn(authService, 'login').mockResolvedValueOnce(data);

      const result = await authController.login(signinDto);

      expect(authService.login).toHaveBeenCalledWith(signinDto);
      expect(result).toEqual({ data });
    });
  });

  describe('refresh', () => {
    it('should call AuthService.refresh and return new tokens', async () => {
      const req = { user: { refreshToken: 'some-refresh-token' } };
      const mockTokens = {
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
        expiresIn: 3600,
      };
      jest.spyOn(authService, 'refresh').mockResolvedValueOnce(mockTokens);

      const result = await authController.refresh(req);

      expect(authService.refresh).toHaveBeenCalledWith('some-refresh-token');
      expect(result).toEqual({ data: mockTokens });
    });
  });
});
