import {CreateUser, User} from "../types/models";

export const mockUserRequestData: CreateUser = {
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
};

export const mockDBUser: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  password: "hashedPassword123",
  accessToken: "",
  created_at: "2023-08-02T15:22:22.000Z",
  updated_at: "2023-08-02T15:22:22.000Z",
};
