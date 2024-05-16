type Exec<T> = { exec: () => T };
type Lean<T> = { lean: () => Exec<T> };
type Sort<T> = { sort: () => Exec<T> };
export abstract class MockModel<T> {
  protected abstract entityStub: T;

  findOne(): Sort<T> | Lean<T> | Exec<T> {
    return {
      lean: () => ({
        exec: (): T => this.entityStub,
      }),
    };
  }

  populate(): Sort<T> | Lean<T> | Exec<T> {
    return {
      lean: () => ({
        exec: (): T => this.entityStub,
      }),
    };
  }

  findById(): { exec: () => T } {
    return {
      exec: (): T => this.entityStub,
    };
  }

  findOneLean(): Exec<T> {
    return {
      exec: (): T => this.entityStub,
    };
  }

  find(): Sort<T[]> | Exec<T[]> {
    return {
      sort: () => ({
        exec: () => [this.entityStub],
      }),
    };
  }

  async create(): Promise<T> {
    return this.entityStub;
  }

  async save(): Promise<T> {
    return this.entityStub;
  }

  findOneAndUpdate(): { exec: () => Promise<T> } {
    return {
      exec: async (): Promise<T> => this.entityStub,
    };
  }

  updateOne(): Exec<unknown> {
    return {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      exec: () => {},
    };
  }

  updateMany(): Exec<unknown> {
    return {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      exec: () => {},
    };
  }

  aggregate(): Exec<T[]> {
    return {
      exec: () => [this.entityStub],
    };
  }

  deleteOne(): Exec<unknown> {
    return this.updateOne();
  }
}
