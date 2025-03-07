import { NotFoundException } from "@nestjs/common";
import { User } from "@prisma/client";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { UpdateUserDto } from "src/users/dto/update-user.dto";
import { UsersController } from "src/users/users.controller";
import { UsersService } from "src/users/users.service";
import { beforeEach, describe, expect, it, vi } from "vitest";

type MockType<T> = {
  [P in keyof T]: ReturnType<typeof vi.fn>;
};

describe("UsersController", () => {
  let usersController: UsersController;
  let usersService: MockType<UsersService>;

  beforeEach(() => {
    usersService = {
      findAll: vi.fn(),
      findOne: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
      coinsRanking: vi.fn(),
      findByEmail: vi.fn(),
      updateCoins: vi.fn(),
    } as unknown as MockType<UsersService>;

    usersController = new UsersController(
      usersService as unknown as UsersService,
    );
  });

  it("should return an array of users", async () => {
    const users: Partial<User>[] = [
      { id: 1, email: "john@example.com", pseudo: "John" },
    ];
    vi.mocked(usersService.findAll).mockResolvedValue(users);

    const result = await usersController.findAll();

    expect(usersService.findAll).toHaveBeenCalled();
    expect(result.length).toBe(users.length);
  });

  it("should return user ranked by coins", async () => {
    const ranking: Array<{
      id: number;
      email: string;
      pseudo: string;
      coins: number;
    }> = [
      { id: 1, email: "top@example.com", pseudo: "TopUser", coins: 100 },
      { id: 2, email: "second@example.com", pseudo: "SecondUser", coins: 50 },
    ];
    vi.mocked(usersService.coinsRanking).mockResolvedValue(ranking);

    const result = await usersController.findRanking();

    expect(usersService.coinsRanking).toHaveBeenCalled();
    expect(result).toBe(ranking);
  });

  it("should create a new user", async () => {
    const dto: CreateUserDto = {
      email: "new@example.com",
      password: "test123",
      pseudo: "NewUser",
    };
    const user: Partial<User> = { ...dto, id: 1 };
    vi.mocked(usersService.create).mockResolvedValue(user);

    const result = await usersController.create(dto);

    expect(usersService.create).toHaveBeenCalledWith(dto);
    expect(result.id).toBe(user.id);
  });

  it("should return a user by id", async () => {
    const user: Partial<User> = {
      id: 1,
      email: "test@gmail.com",
      pseudo: "Test",
    };
    vi.mocked(usersService.findOne).mockResolvedValue(user);

    const result = await usersController.findOne(1);

    expect(usersService.findOne).toHaveBeenCalledWith(1);
    expect(result.id).toBe(user.id);
  });

  it("should return a user by email", async () => {
    const user: Partial<User> = {
      id: 1,
      email: "test@gmail.com",
      pseudo: "Test",
    };
    vi.mocked(usersService.findByEmail).mockResolvedValue(user);

    const result = await usersController.findByEmail("test@gmail.com");

    expect(usersService.findByEmail).toHaveBeenCalledWith("test@gmail.com");
    expect(result.id).toBe(user.id);
  });

  it("should update a user", async () => {
    const userId = 1;
    const updateDto: UpdateUserDto = {
      pseudo: "UpdatedUser",
    };
    const updatedUser: Partial<User> = {
      id: userId,
      email: "test@example.com",
      pseudo: updateDto.pseudo,
    };
    vi.mocked(usersService.update).mockResolvedValue(updatedUser);

    const result = await usersController.update(userId, updateDto);

    expect(usersService.update).toHaveBeenCalledWith(userId, updateDto);
    expect(result.id).toBe(userId);
    expect(result.pseudo).toBe(updateDto.pseudo);
  });

  it("should remove a user", async () => {
    const userId = 1;
    const deletedUser: Partial<User> = {
      id: userId,
      email: "test@example.com",
      pseudo: "TestUser",
    };
    vi.mocked(usersService.remove).mockResolvedValue(deletedUser);

    const result = await usersController.remove(userId);

    expect(usersService.remove).toHaveBeenCalledWith(userId);
    expect(result.id).toBe(userId);
  });

  it("should throw NotFoundException when user not found by id", async () => {
    const userId = 999;
    vi.mocked(usersService.findOne).mockResolvedValue(null);

    await expect(usersController.findOne(userId)).rejects.toThrow(
      NotFoundException,
    );
    expect(usersService.findOne).toHaveBeenCalledWith(userId);
  });

  it("should throw NotFoundException when user not found by email", async () => {
    const email = "nonexistent@example.com";
    vi.mocked(usersService.findByEmail).mockResolvedValue(null);

    await expect(usersController.findByEmail(email)).rejects.toThrow(
      NotFoundException,
    );
    expect(usersService.findByEmail).toHaveBeenCalledWith(email);
  });
});
