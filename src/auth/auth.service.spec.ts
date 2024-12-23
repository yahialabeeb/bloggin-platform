import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { hash, compare } from 'bcryptjs';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;
  let configService: Partial<ConfigService>;

  beforeEach(async () => {
    usersService = {
      findOne: jest.fn(),
      create: jest.fn(),
      findOneById: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn(),
    };

    configService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('signup', () => {
    it('should throw an error if username already exists', async () => {
      (usersService.findOne as jest.Mock).mockResolvedValueOnce({
        username: 'testuser',
      });

      const createUserDto: CreateUserDto = {
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      await expect(authService.signup(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create a user and return account with tokens', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        username: 'newuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const mockCreatedUser = {
        id: '123',
        ...createUserDto,
        password: 'hashedpassword',
      };

      (usersService.findOne as jest.Mock).mockResolvedValueOnce(null);
      (hash as jest.Mock).mockResolvedValueOnce('hashedpassword');
      (usersService.create as jest.Mock).mockResolvedValueOnce(mockCreatedUser);
      (jwtService.signAsync as jest.Mock)
        .mockResolvedValueOnce('accessToken')
        .mockResolvedValueOnce('refreshToken');
      (configService.get as jest.Mock).mockReturnValue(3600);

      const result = await authService.signup(createUserDto);

      expect(usersService.findOne).toHaveBeenCalledWith('newuser');
      expect(hash).toHaveBeenCalledWith('password123', 10);
      expect(usersService.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashedpassword',
      });
      expect(result).toEqual({
        id: '123',
        name: 'Test User',
        username: 'newuser',
        email: 'test@example.com',
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        expiresIn: 3600,
      });
    });
  });

  describe('login', () => {
    it('should validate user credentials and return account with tokens', async () => {
      const mockUser = {
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User',
      };

      (usersService.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
      (compare as jest.Mock).mockResolvedValueOnce(true);
      (jwtService.signAsync as jest.Mock)
        .mockResolvedValueOnce('accessToken')
        .mockResolvedValueOnce('refreshToken');
      (configService.get as jest.Mock).mockReturnValue(3600);

      const result = await authService.login({
        username: 'testuser',
        password: 'password123',
      });

      expect(usersService.findOne).toHaveBeenCalledWith('testuser');
      expect(compare).toHaveBeenCalledWith('password123', 'hashedpassword');
      expect(result).toEqual({
        id: '123',
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        expiresIn: 3600,
      });
    });

    it('should return null if credentials are invalid', async () => {
      (usersService.findOne as jest.Mock).mockResolvedValueOnce(null);

      const result = await authService.login({
        username: 'testuser',
        password: 'password123',
      });

      expect(usersService.findOne).toHaveBeenCalledWith('testuser');
      expect(result).toBeNull();
    });
  });

  describe('refresh', () => {
    it('should return new tokens', async () => {
      (jwtService.signAsync as jest.Mock)
        .mockResolvedValueOnce('newAccessToken')
        .mockResolvedValueOnce('newRefreshToken');
      (configService.get as jest.Mock).mockReturnValue(3600);

      const payload = {
        iss: 'iss',
        email: 'test@example.com',
        username: 'testuser',
        sub: '123',
      };

      const result = await authService.refresh(payload);

      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
        expiresIn: 3600,
      });
    });
  });

  describe('validateUserCredentials', () => {
    it('should validate and return user if credentials match', async () => {
      const mockUser = {
        username: 'testuser',
        password: 'hashedpassword',
      };

      (usersService.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
      (compare as jest.Mock).mockResolvedValueOnce(true);

      const result = await authService.validateUserCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(usersService.findOne).toHaveBeenCalledWith('testuser');
      expect(compare).toHaveBeenCalledWith('password123', 'hashedpassword');
      expect(result).toEqual(mockUser);
    });

    it('should return null if credentials are invalid', async () => {
      (usersService.findOne as jest.Mock).mockResolvedValueOnce(null);

      const result = await authService.validateUserCredentials({
        username: 'testuser',
        password: 'password123',
      });

      expect(usersService.findOne).toHaveBeenCalledWith('testuser');
      expect(result).toBeNull();
    });
  });

  describe('validateUser', () => {
    it('should return user if found', async () => {
      const mockUser = { id: '123', username: 'testuser' };

      (usersService.findOneById as jest.Mock).mockResolvedValueOnce(mockUser);

      const result = await authService.validateUser('123');

      expect(usersService.findOneById).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockUser);
    });

    it('should return null if user is not found', async () => {
      (usersService.findOneById as jest.Mock).mockResolvedValueOnce(null);

      const result = await authService.validateUser('123');

      expect(usersService.findOneById).toHaveBeenCalledWith('123');
      expect(result).toBeNull();
    });
  });
});
