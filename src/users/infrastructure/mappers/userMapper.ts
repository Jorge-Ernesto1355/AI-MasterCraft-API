import { User } from "../../domain/entities/User";

export class userMapper {
  static toDomain(model: any) {
    return User.create(model._id, model.username, model.email, model.password);
  }

  static toPersistence(domainUser: User): any {
    return {
      _id: domainUser.getId(),
      username: domainUser.getUsername(),
      email: domainUser.getEmail(),
      password: domainUser.getPassword(),
    };
  }
}
