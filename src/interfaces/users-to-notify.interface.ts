export interface IUsersToNotify {
  _id: string;
  latestToken: Date;
  userInfo: {
    _id: string;
    name: string;
    email: string;
  };
}
