class Result {
  constructor() {
    if (this.constructor === Result) {
      throw new Error(
        "Result 클래스는 추상 클래스로, 직접 인스턴스화할 수 없습니다."
      );
    }
  }

  isSuccess() {
    return this instanceof Success;
  }

  isFailure() {
    return this instanceof Failure;
  }
}

class Success extends Result {
  #value;

  constructor(value) {
    super();
    this.#value = value;
  }

  map(fn) {
    return Ok(fn(this.#value));
  }

  mapErr(fn) {
    return this;
  }

  tap(fn) {
    fn(this.#value);
    return this;
  }

  tapErr(fn) {
    return this;
  }

  andThen(fn) {
    return fn(this.#value);
  }

  unwrap() {
    return this.#value;
  }

  unwrapOr(defaultValue) {
    return this.#value;
  }
}

class Failure extends Result {
  #error;

  constructor(error) {
    super();
    this.#error = error;
  }

  map(fn) {
    return this;
  }

  mapErr(fn) {
    return Err(fn(this.#error));
  }

  tap(fn) {
    return this;
  }

  tapErr(fn) {
    fn(this.#error);
    return this;
  }

  andThen(fn) {
    return this;
  }

  unwrap() {
    throw this.#error;
  }

  unwrapOr(defaultValue) {
    return defaultValue;
  }
}

export const Ok = (value) => new Success(value);
export const Err = (error) => new Failure(error);
