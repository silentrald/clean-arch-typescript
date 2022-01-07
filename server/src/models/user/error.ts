class UserError extends Error {
  constructor(msg: string) {
    super();
    
    this.message = msg;
  }
}

export default UserError;
