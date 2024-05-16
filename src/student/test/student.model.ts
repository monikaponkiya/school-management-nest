import { MockModel } from 'src/test-cases/mock.model';
import { Student } from '../schema/student.schema';

export class StudentTestModel extends MockModel<Student> {
  protected entityStub = new Student();
}
