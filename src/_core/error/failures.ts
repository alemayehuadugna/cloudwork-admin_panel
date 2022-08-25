export abstract class Failure {
	message: string;

	constructor(message: string) { this.message = message; };
}

export class ServerFailure extends Failure {
	constructor(message: string) {
		super(message);
	}
}

export class CacheFailure extends Failure {
	constructor(message: string) {
		super(message);
	}
}

export class ConnectionFailure extends Failure {
	constructor(message: string) {
		super(message);
	}
}
