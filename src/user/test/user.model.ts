import { MockModel } from 'src/test-cases/mock.model';
import { User } from '../schema/user.schema';

export class UserTestModel extends MockModel<User> {
  protected entityStub = new User();
}
